//
//  ExportVectorTilesTaskFactory.swift
//  arcgis_map_ios
//
//  Created by Julian Bissekkou on 10.01.23.
//

import Foundation
import ArcGIS

class ExportVectorTilesJobManager {
    
    private let methodChannel: FlutterMethodChannel
    private var instances = [String: AGSExportVectorTilesJob]()
    
    init(messenger: FlutterBinaryMessenger) {
        self.methodChannel = FlutterMethodChannel(
            name: "esri.arcgis.flutter_plugin/export_vector_tiles_job",
            binaryMessenger: messenger
        )
        self.methodChannel.setMethodCallHandler { call, result in
            if(call.method == "create_job") {
                self.createJob(call, result)
            }
            if(call.method == "start_job") {
                self.startJob(call, result)
            }
            if(call.method == "dispose_job") {
                self.disposeJob(call, result)
            }
        }
    }
    
    private func createJob(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        let dict = call.arguments! as! Dictionary<String, Any>
        let jobId = dict["id"] as! String
        let url = dict["url"] as! String
        let maxScale = dict["maxScale"]! as! Double
        let areaOfInterst: EnvelopePayload = try! JsonUtil.objectOfJson(dict["areaOfInterest"]! as! Dictionary<String, Any>)
        let vectorTileCachePath = dict["vectorTileCachePath"] as! String
        
        Task {
            let task = AGSExportVectorTilesTask(url: URL(string: url)!)
            try! await task.loadAsync()
            
            let parameters = try! await task.defaultExportVectorTilesParametersAsync(
                withAreaOfInterest: areaOfInterst.toAGSEnvelope(),
                maxScale: maxScale
            )
            instances[jobId] = task.exportVectorTilesJob(with: parameters, downloadFileURL: URL(string: vectorTileCachePath)!)
            
            result(nil)
        }
    }
    
    private func startJob(_ call: FlutterMethodCall, _ result:@escaping FlutterResult) {
        let dict = call.arguments! as! Dictionary<String, Any>
        let jobId = dict["id"] as! String
        let job = instances[jobId]!
        
        job.start(
            statusHandler: { status in
                
            },
            completion: { data, error in
                if let data = data {
                    result(data)
                }
                if let error = error {
                    result(error)
                }
            }
        )
    }
    
    private func disposeJob(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        let dict = call.arguments! as! Dictionary<String, Any>
        let jobId = dict["id"] as! String
        let job = instances[jobId]!
        
        job.cancel { error in
            self.instances.removeValue(forKey: jobId)
            result(error?.localizedDescription)
        }
    }
}


extension AGSExportVectorTilesTask {
    func loadAsync() async throws {
        return try await withCheckedThrowingContinuation { continuation in
            self.load { error in
                if let error = error {
                    continuation.resume(with: .failure(error))
                }
                else {
                    continuation.resume(returning: Void())
                }
            }
        }
    }
    
    func defaultExportVectorTilesParametersAsync(
        withAreaOfInterest areaOfInterest: AGSEnvelope,
        maxScale: Double
    ) async throws  -> AGSExportVectorTilesParameters {
        let params = AGSExportVectorTilesParameters()
        params.areaOfInterest
        params.esriVectorTilesDownloadOption = .useReducedFontsService
        params.maxLevel = 2
        
        try await withCheckedThrowingContinuation { continuation in
            self.defaultExportVectorTilesParameters(withAreaOfInterest: areaOfInterest, maxScale: maxScale) { result, error in
                if let error = error {
                    continuation.resume(with: .failure(error))
                } else {
                    continuation.resume(returning: result!)
                }
            }
        }
    }
}
