import json

def analyze_lint(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    non_prettier_errors = []
    for file_entry in data:
        for message in file_entry['messages']:
            if message['ruleId'] != 'prettier/prettier':
                non_prettier_errors.append({
                    'file': file_entry['filePath'],
                    'line': message['line'],
                    'column': message['column'],
                    'ruleId': message['ruleId'],
                    'message': message['message'],
                    'severity': message['severity']
                })
    
    print(f"Total non-prettier issues: {len(non_prettier_errors)}")
    
    # Sort and group by ruleId
    by_rule = {}
    for err in non_prettier_errors:
        rid = err['ruleId']
        if rid not in by_rule:
            by_rule[rid] = []
        by_rule[rid].append(err)
    
    for rid, errs in by_rule.items():
        print(f"\nRule: {rid} ({len(errs)} occurrences)")
        # Show first 5 examples
        for e in errs[:5]:
            print(f"  - {e['file']}:{e['line']} - {e['message']}")

if __name__ == "__main__":
    analyze_lint('lint-results.json')
