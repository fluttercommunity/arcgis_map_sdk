package esri.arcgis.flutter_plugin

import com.esri.arcgisruntime.concurrent.Job
import com.esri.arcgisruntime.tasks.vectortilecache.ExportVectorTilesJob
import com.esri.arcgisruntime.tasks.vectortilecache.ExportVectorTilesTask
import esri.arcgis.flutter_plugin.model.ExportVectorTilesParametersPayload
import esri.arcgis.flutter_plugin.model.toExportVectorTilesParameters
import io.flutter.plugin.common.BinaryMessenger
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel

class ArcgisMapService(binaryMessenger: BinaryMessenger) :
    MethodChannel.MethodCallHandler {
    // Key is the id of the task, the value is the actual task
    private var exportVectorTilesTasks = mutableMapOf<String, ExportVectorTilesTask>()

    // Key is the id of the task that created the job, the value is the actual job.
    private var exportVectorTilesJobs = mutableMapOf<String, ExportVectorTilesJob>()

    private var methodChannel: MethodChannel =
        MethodChannel(binaryMessenger, "esri.arcgis.flutter_plugin")

    init {
        methodChannel.setMethodCallHandler(this)
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        when (call.method) {
            "create_export_vector_tiles_task" -> onCreateExportVectorTilesTask(call, result)
            "start_export_vector_tiles_task_job" -> onStartExportVectorTilesTaskJob(call, result)
            "cancel_export_vector_tiles_task_job" -> onDisposeJob(call, result)
            "cancel_export_vector_tiles_task_jobs" -> onDisposeJobs(result)
        }
    }

    private fun onDisposeJobs(result: MethodChannel.Result) {
        disposeExportVectorTileJobs()
        result.success(null)
    }

    private fun onDisposeJob(call: MethodCall, result: MethodChannel.Result) {
        val map = call.arguments as Map<String, Any>
        val taskId = map["taskId"] as String

        val job = exportVectorTilesJobs[taskId]
        if (job == null) {
            result.error("job_not_found", "Job with id $taskId was not found.", null)
            return
        }

        val success = job.cancel()
        if (!success) {
            result.error("job_cancel_failed", "Canceling job failed.", null)
            return
        }

        result.success(null)
    }


    private fun onCreateExportVectorTilesTask(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        val args = call.arguments as Map<String, Any>
        val url = args["url"] as String
        val taskId = args["id"] as String
        val exportTask = ExportVectorTilesTask(url)
        exportVectorTilesTasks[taskId] = exportTask
        result.success(null)
    }

    private fun onStartExportVectorTilesTaskJob(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        val args = call.arguments as Map<String, Any>
        val taskId = args["taskId"] as String
        val exportParametersMap = args["exportVectorTilesParameters"] as Map<String, Any>
        val parameters = exportParametersMap.parseToClass<ExportVectorTilesParametersPayload>()
            .toExportVectorTilesParameters()
        val vectorTileCachePath = args["vectorTileCachePath"] as String
        val task = exportVectorTilesTasks[taskId]!!
        val job = task.exportVectorTiles(parameters, vectorTileCachePath)

        // Cancel the existing job before we overwrite it.
        exportVectorTilesJobs[taskId]?.cancel()
        exportVectorTilesJobs[taskId] = job

        val progressListener = {
            methodChannel.invokeMethod(
                "export_vector_tiles_job_progress",
                mapOf("taskId" to taskId, "progress" to job.progress.toDouble())
            )
        }

        lateinit var jobChangedListener: Runnable
        jobChangedListener = Runnable {
            when (job.status) {
                Job.Status.FAILED -> {
                    job.removeProgressChangedListener(progressListener)
                    job.removeJobChangedListener(jobChangedListener)
                    result.error(
                        "download_failed",
                        job.error.message + " error code: ${job.error.errorCode}",
                        job.error.additionalMessage
                    )
                }

                Job.Status.SUCCEEDED -> {
                    job.removeProgressChangedListener(progressListener)
                    job.removeJobChangedListener(jobChangedListener)
                    result.success(null)
                }

                else -> {}
            }
        }

        job.addProgressChangedListener(progressListener)
        job.addJobChangedListener(jobChangedListener)
        job.start()
    }

    fun disposeExportVectorTileJobs() {
        val idsToRemove = mutableListOf<String>()
        exportVectorTilesJobs.entries.forEach { (taskId, job) ->
            job.cancel()
            idsToRemove.add(taskId)
        }
        idsToRemove.forEach(exportVectorTilesJobs::remove)
    }
}
