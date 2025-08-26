package com.businesscentral.model;

import java.util.Map;

public class ExecutionRequest {
    private String assetId;
    private Map<String, Object> inputData;

    public ExecutionRequest() {}

    public ExecutionRequest(String assetId, Map<String, Object> inputData) {
        this.assetId = assetId;
        this.inputData = inputData;
    }

    public String getAssetId() { return assetId; }
    public void setAssetId(String assetId) { this.assetId = assetId; }

    public Map<String, Object> getInputData() { return inputData; }
    public void setInputData(Map<String, Object> inputData) { this.inputData = inputData; }
}
