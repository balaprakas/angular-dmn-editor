package com.businesscentral.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ValidationService {

    public ValidationResult validateBpmn(String content) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (content == null || content.trim().isEmpty()) {
            errors.add("BPMN content cannot be empty");
            return new ValidationResult(false, errors, warnings);
        }

        if (!content.contains("<?xml") || !content.contains("bpmn")) {
            errors.add("Invalid BPMN format - must be valid XML with BPMN elements");
        }

        if (!content.contains("process")) {
            warnings.add("BPMN should contain at least one process definition");
        }

        return new ValidationResult(errors.isEmpty(), errors, warnings);
    }

    public ValidationResult validateDmn(String content) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (content == null || content.trim().isEmpty()) {
            errors.add("DMN content cannot be empty");
            return new ValidationResult(false, errors, warnings);
        }

        if (!content.contains("<?xml") || !content.contains("dmn")) {
            errors.add("Invalid DMN format - must be valid XML with DMN elements");
        }

        if (!content.contains("decision")) {
            warnings.add("DMN should contain at least one decision definition");
        }

        return new ValidationResult(errors.isEmpty(), errors, warnings);
    }

    public ValidationResult validateDrl(String content) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (content == null || content.trim().isEmpty()) {
            errors.add("DRL content cannot be empty");
            return new ValidationResult(false, errors, warnings);
        }

        if (!content.contains("rule")) {
            warnings.add("DRL should contain at least one rule definition");
        }

        if (content.contains("rule") && !content.contains("when") && !content.contains("then")) {
            errors.add("DRL rules must contain 'when' and 'then' clauses");
        }

        return new ValidationResult(errors.isEmpty(), errors, warnings);
    }

    public static class ValidationResult {
        private final boolean valid;
        private final List<String> errors;
        private final List<String> warnings;

        public ValidationResult(boolean valid, List<String> errors, List<String> warnings) {
            this.valid = valid;
            this.errors = errors;
            this.warnings = warnings;
        }

        public boolean isValid() { return valid; }
        public List<String> getErrors() { return errors; }
        public List<String> getWarnings() { return warnings; }
    }
}
