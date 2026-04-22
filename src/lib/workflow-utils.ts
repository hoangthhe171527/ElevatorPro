import { 
  INSTALL_STAGES_TEMPLATE, 
  type Project, 
  type Job, 
  type Contract,
  type Customer,
  type Lead,
  type Invoice,
  type InvoiceStatus,
  mockContracts,
  mockProjects,
  mockJobs
} from "./mock-data";

/**
 * PHASE 1: CRM - Lead to Customer Conversion
 */
export function handleLeadConversion(
  lead: Lead, 
  referralSourceId?: string
): { customer: Customer; contract: Contract } {
  const customerId = `c-auto-${Date.now()}`;
  
  const customer: Customer = {
    tenantId: lead.tenantId,
    id: customerId,
    name: lead.name,
    contactPerson: lead.name,
    phone: lead.phone,
    email: lead.email,
    address: lead.address,
    type: "business",
    elevatorCount: 0,
    createdAt: new Date().toISOString(),
    lat: 0,
    lng: 0,
    customerType: "buying",
    convertedFromLeadId: lead.id,
    referredById: referralSourceId,
    referralPoints: referralSourceId ? 100 : 0,
  };

  const contract: Contract = {
    tenantId: lead.tenantId,
    id: `ct-auto-${Date.now()}`,
    code: `CT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    customerId: customerId,
    type: "install",
    value: lead.estimatedValue,
    paid: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "draft",
    items: ["Cung cấp và lắp đặt thang máy trọn gói"],
    signedAt: "",
    milestones: [],
    paymentStages: { stage1Paid: 0, stage2Paid: 0, stage3Paid: 0 },
    accountantVerified: false,
    ceoVerified: false,
  };

  return { customer, contract };
}

/**
 * Utility to calculate technician workload (count of active/scheduled jobs)
 */
export function getTechnicianWorkload(techId: string): number {
  return mockJobs.filter(j => 
    j.assignedTo === techId && 
    (j.status === "scheduled" || j.status === "in_progress" || j.status === "appointment_confirmed" || j.status === "waiting_for_materials")
  ).length;
}

/**
 * PHASE 1.5: Maintenance Lead Conversion
 */
export function handleMaintenanceLeadConversion(
  lead: Lead
): { customer: Customer; contract: Contract } {
  const customerId = `c-maint-${Date.now()}`;
  
  const customer: Customer = {
    tenantId: lead.tenantId,
    id: customerId,
    name: lead.name,
    contactPerson: lead.name,
    phone: lead.phone,
    email: lead.email,
    address: lead.address,
    type: "business",
    elevatorCount: 1, // Assume 1 for maintenance lead
    createdAt: new Date().toISOString(),
    lat: 0,
    lng: 0,
    customerType: "service_only",
    convertedFromLeadId: lead.id,
  };

  const contract: Contract = {
    tenantId: lead.tenantId,
    id: `ct-maint-${Date.now()}`,
    code: `MC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    customerId: customerId,
    type: "maintenance",
    value: lead.estimatedValue,
    paid: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "draft",
    items: ["Dịch vụ bảo trì thang máy định kỳ mẫu"],
    signedAt: "",
    milestones: [],
    paymentStages: { stage1Paid: 0, stage2Paid: 0, stage3Paid: 0 },
    accountantVerified: false,
    ceoVerified: false,
  };

  return { customer, contract };
}

/**
 * PHASE 2: Activation -> Waiting for Equipment
 * After Contract is signed + Contract File Uploaded, move Project to 'waiting_for_equipment'.
 */
export function handleContractActivation(
  contract: Contract,
  projectName?: string
): { project: Project } {
  const projectId = `p-auto-${contract.id}`;
  
  const project: Project = {
    tenantId: contract.tenantId,
    id: projectId,
    name: projectName || `Lắp đặt thang máy - ${contract.code}`,
    address: "Địa chỉ theo hợp đồng",
    customerId: contract.customerId,
    startDate: new Date().toISOString().split('T')[0],
    status: "in_progress",
    stage: "waiting_for_equipment", // Jump straight to this as per user request
  };

  return { project };
}

/**
 * PHASE 3: Equipment Arrival -> Installation Jobs
 * When CEO confirms equipment arrival, system generates the 8 install jobs.
 */
export function handleEquipmentArrival(
  project: Project,
  contract: Contract
): { jobs: Job[] } {
  const jobs: Job[] = INSTALL_STAGES_TEMPLATE.map((stage, index) => {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + (index * 7) + 7);
    
    return {
      tenantId: project.tenantId,
      id: `j-auto-${project.id}-${stage.id}`,
      code: `JOB-INSTALL-${stage.order}`,
      type: "install",
      title: stage.label,
      description: `Giai đoạn ${stage.order} dự án ${project.name}`,
      customerId: project.customerId,
      projectId: project.id,
      contractId: contract.id,
      assignedTo: "u-tech-all-2",
      priority: "normal",
      status: index === 0 ? "scheduled" : "pending",
      scheduledFor: scheduledDate.toISOString().slice(0, 16),
      beforePhotos: [],
      afterPhotos: [],
      createdAt: new Date().toISOString(),
    };
  });

  return { jobs };
}

/**
 * PHASE 4: Handover -> Warranty transition
 * Checks if total paid matches contract values and CEO has approved.
 */
export function handleFinalVerification(
  contract: Contract,
  enteredTotal: number
): { success: boolean; message: string } {
  const isMatch = Math.abs(contract.value - enteredTotal) < 1000; // allow for tiny rounding if any
  
  if (!isMatch) {
    return { 
      success: false, 
      message: "Số tiền Kế toán nhập bị lệch so với Hợp đồng. CEO từ chối phê duyệt." 
    };
  }

  return { 
    success: true, 
    message: "CEO đã phê duyệt số tiền. Dự án đủ điều kiện chuyển sang Bảo hành." 
  };
}

/**
 * Reusable project completion to warranty logic
 */
export function initiateWarrantyFlow(
  project: Project,
  contractValue: number
): { invoice: Invoice; warrantyProject: Project } {
  const invoice: Invoice = {
    tenantId: project.tenantId,
    id: `inv-final-${project.id}`,
    code: `INV-FINAL-${project.id}`,
    customerId: project.customerId,
    targetType: "project",
    targetId: project.id,
    amount: contractValue * 0.2, // Dummy 20%
    dueDate: new Date().toISOString().split('T')[0],
    status: "paid",
    description: "Hóa đơn quyết toán cuối sau khi bàn giao (Đã CEO duyệt)",
    createdAt: new Date().toISOString(),
  };

  const warrantyProject: Project = {
    tenantId: project.tenantId,
    id: `p-warranty-${project.id}`,
    name: `Bảo hành: ${project.name}`,
    address: project.address,
    customerId: project.customerId,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "in_progress",
    stage: "transition",
  };

  return { invoice, warrantyProject };
}
