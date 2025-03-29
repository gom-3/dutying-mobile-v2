package expo.modules.widget

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager

class WidgetModule : Module() {
  override fun definition() = ModuleDefinition {
  Name("Widget")

  Function("reloadAll") {
    val widgetName = getWidgetName()
    if (widgetName == null) {
      throw Exception("Couldn't read widgetName from app.json")
    }
    val widgetComponentName = getWidgetComponentName(widgetName)
    if (widgetComponentName == null) {
      throw Exception("Couldn't find widgetName component name")
    }
    val widgetManager = AppWidgetManager.getInstance(context)
    val appWidgetIds = widgetManager.getAppWidgetIds(widgetComponentName)

    val updateIntent =
        Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE, null).setComponent(widgetComponentName)
    updateIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds)

    context.sendBroadcast(updateIntent)
    }
    
    Function("setItem") { value: String, key: String, appGroup: String ->
      getPreferences(appGroup).edit().putString(key, value).commit()
    }

    Function("getItem") { key: String, appGroup: String ->
      return@Function getPreferences(appGroup).getString(key, "")
    }
  }

  private val context
    get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(appGroup: String): SharedPreferences {
    return context.getSharedPreferences(appGroup, Context.MODE_PRIVATE)
  }

  private fun getWidgetName(): String {
    return "Widget"
  }

  private fun getWidgetComponentName(widgetName: String): ComponentName? {
    val widgetList = AppWidgetManager.getInstance(context).getInstalledProviders()
    for (providerInfo in widgetList) {
      if (providerInfo.provider.getPackageName().equals(context.getPackageName()) &&
              providerInfo.provider.getShortClassName().endsWith("." + widgetName)
      ) {
        return providerInfo.provider
      }
    }

    return null
  }

}
