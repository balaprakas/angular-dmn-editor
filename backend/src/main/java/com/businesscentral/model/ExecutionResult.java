package com.businesscentral.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.Map;

public class ExecutionResult {
    private String assetId;
    private String assetType;
    private Map<String, Object> inputData;
    private Map<String, Object> outputData;
    private boolean success;
    private String errorMessage;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime executedAt;

    public ExecutionResult() {
        this.executedAt = LocalDateTime.now();
    }

    public ExecutionResult(String assetId, String assetType, Map<String, Object> inputData, 
                          Map<String, Object> outputData, boolean success, String errorMessage) {
        this();
        this.assetId = assetId;
        this.assetType = assetType;
        this.inputData = inputData;
        this.outputData = outputData;
        this.success = success;
        this.errorMessage = errorMessage;
    }

    public String getAssetId() { return assetId; }
    public void setAssetId(String assetId) { this.assetId = assetId; }

    public String getAssetType() { return assetType; }
    public void setAssetType(String assetType) { this.assetType = assetType; }

    public Map<String, Object> getInputData() { return inputData; }
    public void setInputData(Map<String, Object> inputData) { this.inputData = inputData; }

    public Map<String, Object> getOutputData() { return outputData; }
    public void setOutputData(Map<String, Object> outputData) { this.outputData = outputData; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public LocalDateTime getExecutedAt() { return executedAt; }
    public void setExecutedAt(LocalDateTime executedAt) { this.executedAt = executedAt; }
}
