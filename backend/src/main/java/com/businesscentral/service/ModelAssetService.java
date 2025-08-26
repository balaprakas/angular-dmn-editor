package com.businesscentral.service;

import com.businesscentral.model.ModelAsset;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ModelAssetService {
    
    private final Map<String, ModelAsset> assets = new ConcurrentHashMap<>();

    public List<ModelAsset> getAllAssets() {
        return new ArrayList<>(assets.values());
    }

    public List<ModelAsset> getAssetsByType(String type) {
        return assets.values().stream()
                .filter(asset -> type.equalsIgnoreCase(asset.getType()))
                .toList();
    }

    public Optional<ModelAsset> getAssetById(String id) {
        return Optional.ofNullable(assets.get(id));
    }

    public ModelAsset createAsset(ModelAsset asset) {
        if (asset.getId() == null || asset.getId().isEmpty()) {
            asset.setId(UUID.randomUUID().toString());
        }
        assets.put(asset.getId(), asset);
        return asset;
    }

    public Optional<ModelAsset> updateAsset(String id, ModelAsset updatedAsset) {
        if (assets.containsKey(id)) {
            updatedAsset.setId(id);
            assets.put(id, updatedAsset);
            return Optional.of(updatedAsset);
        }
        return Optional.empty();
    }

    public boolean deleteAsset(String id) {
        return assets.remove(id) != null;
    }

    public boolean assetExists(String id) {
        return assets.containsKey(id);
    }
}
