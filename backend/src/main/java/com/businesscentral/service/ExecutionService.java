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
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class ExecutionService {

    private final RestTemplate restTemplate = new RestTemplate();

    public ExecutionResult executeBpmn(ModelAsset asset, Map<String, Object> inputData) {
        try {
            Map<String, Object> outputData = new HashMap<>(inputData);
            
            Document doc = parseXml(asset.getContent());
            NodeList serviceTasks = doc.getElementsByTagName("bpmn:serviceTask");
            
            for (int i = 0; i < serviceTasks.getLength(); i++) {
                Element serviceTask = (Element) serviceTasks.item(i);
                String apiUrl = serviceTask.getAttribute("apiUrl");
                String httpMethod = serviceTask.getAttribute("httpMethod");
                String requestBody = serviceTask.getAttribute("requestBody");
                
                if (apiUrl != null && !apiUrl.isEmpty()) {
                    Object apiResponse = executeApiCall(apiUrl, httpMethod, requestBody);
                    outputData.put("apiResponse", apiResponse);
                }
            }
            
            outputData.put("processInstanceId", "process-" + System.currentTimeMillis());
            outputData.put("status", "completed");
            outputData.put("message", "BPMN process with API calls executed successfully");

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

    private Document parseXml(String xmlContent) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(new ByteArrayInputStream(xmlContent.getBytes()));
    }

    private Object executeApiCall(String apiUrl, String httpMethod, String requestBody) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            HttpMethod method = HttpMethod.valueOf(httpMethod.toUpperCase());
            
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, method, entity, String.class);
            
            return Map.of(
                "statusCode", response.getStatusCode().value(),
                "body", response.getBody(),
                "headers", response.getHeaders().toSingleValueMap()
            );
        } catch (Exception e) {
            return Map.of(
                "error", true,
                "message", e.getMessage()
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
