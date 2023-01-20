//
//  ExportVectorTilesTaskFactory.swift
//  arcgis_map_ios
//
//  Created by Julian Bissekkou on 10.01.23.
//

import Foundation
import ArcGIS

class ArcgisMapService {
    
    // Key is the id of the task, the value is the actual task
    private var exportVectorTilesTasks = [String: AGSExportVectorTilesTask]()
    
    // Key is the id of the task that created the job, the value is the actual job.
    private var exportVectorTilesJobs = [String: AGSExportVectorTilesJob]()
    
    private let methodChannel: FlutterMethodChannel
    
    init(methodChannel: FlutterMethodChannel) {
        self.methodChannel = methodChannel
    }
    
    public func onCreateExportVectorTilesTask(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        let dict = call.arguments! as! Dictionary<String, Any>
        let url = dict["url"] as! String
        let taskId = dict["id"] as! String
        
        let exportTask = AGSExportVectorTilesTask(url: URL(string: url)!)
        exportVectorTilesTasks[taskId] = exportTask
        result(nil)
    }
    
    public func onStartExportVectorTileTaskJob(_ call: FlutterMethodCall, _ result:@escaping FlutterResult) {
        let dict = call.arguments! as! Dictionary<String, Any>
        let taskId = dict["taskId"] as! String
        let exportParamsDict = dict["exportVectorTilesParameters"] as! Dictionary<String, Any>
        let exportParams: ExportVectorTilesParametersPayload = try! JsonUtil.objectOfJson(exportParamsDict)
        let vectorTileCachePath = dict["vectorTileCachePath"] as! String
        let task = exportVectorTilesTasks[taskId]!
        
        let job = task.exportVectorTilesJob(
            with: exportParams.toAgsExportVectorTileParameters(),
            downloadFileURL: URL(string: vectorTileCachePath)!
        )
        // Cancel the existing job before we overwrite it.
        if let existingJob = exportVectorTilesJobs[taskId] {
            existingJob.cancel {_ in }
        }
        exportVectorTilesJobs[taskId] = job
        
        job.start(
            statusHandler: { status in
                let progress = Double(job.progress.completedUnitCount) / Double(job.progress.totalUnitCount)
                
                self.methodChannel.invokeMethod(
                    "export_vector_tiles_job_progress",
                    arguments: ["taskId" : taskId, "progress" : progress]
                )
                
                // TODO how to notify when job is cancled?
                switch(status) {
                case .succeeded:
                    result(nil)
                case .failed:
                    result(FlutterError(code: "download_failed", message: "Download failed \(job.error?.localizedDescription)", details: nil))
                @unknown default:
                    print("\(status)")
                }
            },
            completion: { data, error in
                if let error = error {
                    result(FlutterError(code: "export_task_error", message: error.localizedDescription, details: nil))
                } else {
                    result(nil)
                }
            }
        )
    }
    
    public func cancelJob(_ call: FlutterMethodCall, _ result:@escaping FlutterResult) {
        let dict = call.arguments as! Dictionary<String, Any>
        let taskId = dict["taskId"] as! String
        
        guard let job = exportVectorTilesJobs[taskId] else {
            result(FlutterError(code: "task_not_found", message: "Task with id\(taskId) not found", details: nil))
            return
        }
        
        
        job.cancel { error in
            guard let error = error else {
                result(nil)
                return
            }
            result(FlutterError(code: "job_cancel_failed", message: "Canceling job failed: \(error.localizedDescription)", details: nil))
        }
    }
    
    public func cancelJobs(_ result:@escaping FlutterResult) {
        exportVectorTilesJobs.forEach { taskId, job in
            job.cancel { _ in
                self.exportVectorTilesJobs[taskId] = nil
            }
        }
        
        result(nil)
    }
}


struct ExportVectorTilesParametersPayload: Codable {
    let areaOfInterest: EnvelopePayload
    let maxLevel: Int
}

extension ExportVectorTilesParametersPayload {
    func toAgsExportVectorTileParameters() -> AGSExportVectorTilesParameters {
        let params = AGSExportVectorTilesParameters()
        params.maxLevel = self.maxLevel
        params.areaOfInterest = self.areaOfInterest.toAGSEnvelope(spatialReference: .webMercator())
        
        return params
    }
}
