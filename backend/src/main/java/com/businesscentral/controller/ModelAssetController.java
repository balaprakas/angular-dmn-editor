package com.businesscentral.controller;

import com.businesscentral.model.ModelAsset;
import com.businesscentral.service.ModelAssetService;
import com.businesscentral.service.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
public class ModelAssetController {

    @Autowired
    private ModelAssetService modelAssetService;

    @Autowired
    private ValidationService validationService;

    @GetMapping
    public ResponseEntity<List<ModelAsset>> getAllAssets() {
        return ResponseEntity.ok(modelAssetService.getAllAssets());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ModelAsset>> getAssetsByType(@PathVariable String type) {
        return ResponseEntity.ok(modelAssetService.getAssetsByType(type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModelAsset> getAssetById(@PathVariable String id) {
        Optional<ModelAsset> asset = modelAssetService.getAssetById(id);
        return asset.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ModelAsset> createAsset(@RequestBody ModelAsset asset) {
        try {
            ModelAsset createdAsset = modelAssetService.createAsset(asset);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAsset);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModelAsset> updateAsset(@PathVariable String id, @RequestBody ModelAsset asset) {
        Optional<ModelAsset> updatedAsset = modelAssetService.updateAsset(id, asset);
        return updatedAsset.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable String id) {
        boolean deleted = modelAssetService.deleteAsset(id);
        return deleted ? ResponseEntity.noContent().build() 
                      : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<ValidationService.ValidationResult> validateAsset(@PathVariable String id) {
        Optional<ModelAsset> asset = modelAssetService.getAssetById(id);
        if (asset.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ValidationService.ValidationResult result;
        switch (asset.get().getType().toUpperCase()) {
            case "BPMN":
                result = validationService.validateBpmn(asset.get().getContent());
                break;
            case "DMN":
                result = validationService.validateDmn(asset.get().getContent());
                break;
            case "DRL":
                result = validationService.validateDrl(asset.get().getContent());
                break;
            default:
                return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(result);
    }
}
