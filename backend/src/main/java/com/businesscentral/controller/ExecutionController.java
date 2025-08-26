package com.businesscentral.controller;

import com.businesscentral.model.ExecutionRequest;
import com.businesscentral.model.ExecutionResult;
import com.businesscentral.model.ModelAsset;
import com.businesscentral.service.ExecutionService;
import com.businesscentral.service.ModelAssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/execution")
@CrossOrigin(origins = "*")
public class ExecutionController {

    @Autowired
    private ExecutionService executionService;

    @Autowired
    private ModelAssetService modelAssetService;

    @PostMapping("/execute")
    public ResponseEntity<ExecutionResult> executeAsset(@RequestBody ExecutionRequest request) {
        Optional<ModelAsset> asset = modelAssetService.getAssetById(request.getAssetId());
        if (asset.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ExecutionResult result;
        switch (asset.get().getType().toUpperCase()) {
            case "BPMN":
                result = executionService.executeBpmn(asset.get(), request.getInputData());
                break;
            case "DMN":
                result = executionService.executeDmn(asset.get(), request.getInputData());
                break;
            case "DRL":
                result = executionService.executeDrl(asset.get(), request.getInputData());
                break;
            default:
                return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/bpmn/{id}")
    public ResponseEntity<ExecutionResult> executeBpmn(@PathVariable String id, @RequestBody ExecutionRequest request) {
        Optional<ModelAsset> asset = modelAssetService.getAssetById(id);
        if (asset.isEmpty() || !"BPMN".equalsIgnoreCase(asset.get().getType())) {
            return ResponseEntity.notFound().build();
        }

        ExecutionResult result = executionService.executeBpmn(asset.get(), request.getInputData());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/dmn/{id}")
    public ResponseEntity<ExecutionResult> executeDmn(@PathVariable String id, @RequestBody ExecutionRequest request) {
        Optional<ModelAsset> asset = modelAssetService.getAssetById(id);
        if (asset.isEmpty() || !"DMN".equalsIgnoreCase(asset.get().getType())) {
            return ResponseEntity.notFound().build();
        }

        ExecutionResult result = executionService.executeDmn(asset.get(), request.getInputData());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/drl/{id}")
    public ResponseEntity<ExecutionResult> executeDrl(@PathVariable String id, @RequestBody ExecutionRequest request) {
        Optional<ModelAsset> asset = modelAssetService.getAssetById(id);
        if (asset.isEmpty() || !"DRL".equalsIgnoreCase(asset.get().getType())) {
            return ResponseEntity.notFound().build();
        }

        ExecutionResult result = executionService.executeDrl(asset.get(), request.getInputData());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/execute-bpmn")
    public ResponseEntity<ExecutionResult> executeBpmnXml(@RequestBody Map<String, Object> request) {
        try {
            String bpmnXml = (String) request.get("bpmnXml");
            Map<String, Object> variables = (Map<String, Object>) request.getOrDefault("variables", new HashMap<>());
            
            if (bpmnXml == null || bpmnXml.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            ModelAsset tempAsset = new ModelAsset();
            tempAsset.setId("temp-" + System.currentTimeMillis());
            tempAsset.setContent(bpmnXml);
            tempAsset.setType("BPMN");
            
            ExecutionResult result = executionService.executeBpmn(tempAsset, variables);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            ExecutionResult errorResult = new ExecutionResult(
                null, "BPMN", null, null, false, 
                "Execution failed: " + e.getMessage()
            );
            return ResponseEntity.status(500).body(errorResult);
        }
    }
}
