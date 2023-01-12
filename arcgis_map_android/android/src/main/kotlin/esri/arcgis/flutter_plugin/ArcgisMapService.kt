package esri.arcgis.flutter_plugin

import android.util.Log
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
    private var exportVectorTilesTasks = mutableMapOf<String,ExportVectorTilesTask>()
    private var exportVectorTilesJobs = mutableListOf<ExportVectorTilesJob>()
    private var methodChannel: MethodChannel =
        MethodChannel(binaryMessenger, "esri.arcgis.flutter_plugin")

    init {
        methodChannel.setMethodCallHandler(this)
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        val arguments = call.arguments as Map<String, Any>?
        when (call.method) {
            "create_export_vector_tiles_task" -> onCreateExportVectorTilesTask(arguments!!, result)
            "start_export_vector_tiles_task_job" -> onStartExportVectorTilesTaskJob(
                arguments!!,
                result
            )
        }
    }


    private fun onCreateExportVectorTilesTask(
        arguments: Map<String, Any>,
        result: MethodChannel.Result
    ) {
        val url = arguments["url"] as String
        val taskId = arguments["id"] as String
        val exportTask = ExportVectorTilesTask(url)
        exportVectorTilesTasks[taskId] = exportTask
        result.success(null)
    }

    private fun onStartExportVectorTilesTaskJob(
        arguments: Map<String, Any>,
        result: MethodChannel.Result
    ) {
        val taskId = arguments["taskId"] as String
        val exportParametersMap = arguments["exportVectorTilesParameters"] as Map<String, Any>
        val parameters = exportParametersMap.parseToClass<ExportVectorTilesParametersPayload>()
            .toExportVectorTilesParameters()
        val vectorTileCachePath = arguments["vectorTileCachePath"] as String
        val task = exportVectorTilesTasks[taskId]!!
        val job = task.exportVectorTiles(parameters, vectorTileCachePath)
        exportVectorTilesJobs.add(job)

        val progressListener = {
            methodChannel.invokeMethod(
                "export_vector_tiles_job_progress",
                mapOf("taskId" to taskId, "progress" to job.progress)
            )
        }

        lateinit var jobChangedListener: Runnable;
        jobChangedListener = Runnable {
            when (job.status) {
                Job.Status.FAILED -> {
                    job.removeProgressChangedListener(progressListener)
                    job.removeJobChangedListener(jobChangedListener)
                    result.error(
                        job.error.errorCode.toString(),
                        job.error.message,
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
        exportVectorTilesJobs.forEach {
            it.cancel()
        }
    }
}