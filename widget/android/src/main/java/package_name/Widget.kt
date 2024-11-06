package com.gom3.dutying

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import org.json.JSONObject
import android.graphics.Color;

/**
 * Implementation of App Widget functionality.
 */
class Widget : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        // There may be multiple widgets active, so update all of them
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        // Enter relevant functionality for when the first widget is created
    }

    override fun onDisabled(context: Context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}

internal fun updateAppWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int
) {
    // change this to group value passed in app.json
    val jsonString = getItem(context, "savedData", "group.expo.modules.widgetsync.data") ?: """{"date":{"day":"19","dayName":"일","dayType":"sunday"},"shift":{"name":"이브닝","shortName":"E","color":16747429,"time":"15:00 ~ 22:00"},"schedules":[{"title":"발대식","color":10132735,"time":"09:00 ~ 17:00"},{"title":"asddasd","color":10132735,"time":"08:00 ~ 09:00"}],"closeSchedule":null}"""
    val jsonObject = JSONObject(jsonString)
    val today = jsonObject.getJSONObject("today")
    val date = today.getJSONObject("date")
    val shift = today.optJSONObject("shift")
    val title: String = if(shift !== null) shift.getString("shortName") + " " + shift.getString("name") else "-"
    val mainColor = if(shift !== null) Color.parseColor("#FF${Integer.toHexString(shift.getInt("color"))}") else R.color.blank

    // Construct the RemoteViews object
    val views = RemoteViews(context.packageName, R.layout.sample_widget)
    views.setTextViewText(R.id.widgetTitle, title);
    views.setTextViewText(R.id.widgetDate, date.getString("day") + " " + date.getString("dayName"));
    views.setTextViewText(R.id.widgetTime, if(shift !== null) shift.getString("time") else "-");
    views.setInt(R.id.widgetTitleContainer, "setBackgroundColor", mainColor);

    // Instruct the widget manager to update the widget 
    appWidgetManager.updateAppWidget(appWidgetId, views)
}

internal fun getItem(
    context: Context,
    key: String,
    preferenceName: String
): String? {
    val preferences = context.getSharedPreferences(preferenceName, Context.MODE_PRIVATE)
    return preferences.getString(key, null)
}
