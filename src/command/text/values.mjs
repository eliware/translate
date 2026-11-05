export function collectTextIssues(value, path, maximum, issues) {
  if (typeof value !== "string") {
    issues.push(`${path} must be text.`);
    return;
  }
  if (value.length === 0) {
    issues.push(`${path} must not be empty.`);
    return;
  }
  if (value.length > maximum) issues.push(`${path} must have no more than ${maximum} characters.`);
}

export function collectCommandNameIssues(value, path, issues) {
  collectTextIssues(value, path, 32, issues);
  if (typeof value !== "string" || value.length === 0) return;
  if (!/^[-_'\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u.test(value)) {
    issues.push(`${path} contains characters that Discord does not allow in chat input names.`);
  }
  if (value !== value.toLowerCase()) {
    issues.push(`${path} must use lowercase letters when lowercase forms exist.`);
  }
}
