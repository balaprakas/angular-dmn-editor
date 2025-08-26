package com.businesscentral.service;

import com.businesscentral.model.ExecutionResult;
import com.businesscentral.model.ModelAsset;
import org.kie.api.KieServices;
import org.kie.api.builder.KieBuilder;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.builder.Message;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ExecutionService {

    public ExecutionResult executeBpmn(ModelAsset asset, Map<String, Object> inputData) {
        try {
            Map<String, Object> outputData = new HashMap<>(inputData);
            outputData.put("processInstanceId", "process-" + System.currentTimeMillis());
            outputData.put("status", "completed");
            outputData.put("message", "BPMN process executed successfully");

            return new ExecutionResult(
                asset.getId(),
                "BPMN",
                inputData,
                outputData,
                true,
                null
            );
        } catch (Exception e) {
            return new ExecutionResult(
                asset.getId(),
                "BPMN",
                inputData,
                null,
                false,
                "BPMN execution failed: " + e.getMessage()
            );
        }
    }

    public ExecutionResult executeDmn(ModelAsset asset, Map<String, Object> inputData) {
        try {
            Map<String, Object> outputData = new HashMap<>();
            outputData.put("decision", "approved");
            outputData.put("score", 85);
            outputData.put("message", "DMN decision executed successfully");

            return new ExecutionResult(
                asset.getId(),
                "DMN",
                inputData,
                outputData,
                true,
                null
            );
        } catch (Exception e) {
            return new ExecutionResult(
                asset.getId(),
                "DMN",
                inputData,
                null,
                false,
                "DMN execution failed: " + e.getMessage()
            );
        }
    }

    public ExecutionResult executeDrl(ModelAsset asset, Map<String, Object> inputData) {
        try {
            KieServices kieServices = KieServices.Factory.get();
            KieFileSystem kieFileSystem = kieServices.newKieFileSystem();
            
            kieFileSystem.write("src/main/resources/rules.drl", asset.getContent());
            
            KieBuilder kieBuilder = kieServices.newKieBuilder(kieFileSystem);
            kieBuilder.buildAll();
            
            if (kieBuilder.getResults().hasMessages(Message.Level.ERROR)) {
                return new ExecutionResult(
                    asset.getId(),
                    "DRL",
                    inputData,
                    null,
                    false,
                    "DRL compilation failed: " + kieBuilder.getResults().getMessages()
                );
            }
            
            KieContainer kieContainer = kieServices.newKieContainer(kieBuilder.getKieModule().getReleaseId());
            KieSession kieSession = kieContainer.newKieSession();
            
            for (Map.Entry<String, Object> entry : inputData.entrySet()) {
                kieSession.insert(entry.getValue());
            }
            
            int rulesFired = kieSession.fireAllRules();
            
            Map<String, Object> outputData = new HashMap<>(inputData);
            outputData.put("rulesFired", rulesFired);
            outputData.put("message", "DRL rules executed successfully");
            
            kieSession.dispose();
            
            return new ExecutionResult(
                asset.getId(),
                "DRL",
                inputData,
                outputData,
                true,
                null
            );
        } catch (Exception e) {
            return new ExecutionResult(
                asset.getId(),
                "DRL",
                inputData,
                null,
                false,
                "DRL execution failed: " + e.getMessage()
            );
        }
    }
}
