package com.wetdog.babyhelper;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;

import javax.annotation.Nullable;
import android.util.Log;

/**
NO ESTA EN USO LO MANTENEMOS COMO EJEMPLO.
Ejemplo de código nativo para integrar con React-Native
Mirar el código de react-native-background-task para ver como se integra un módulo

En App.js deberíamos poner esto:

AppRegistry.registerHeadlessTask('BackgroundTask', () => require('./lib/BackgroundTask'));

**/


public class BackgroundTaskService extends HeadlessJsTaskService {

    private static final String TAG = "BackgroundTask";
    @Override
    protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {

        Log.d(TAG,"Returning HeadlessJsTaskConfig, timeout");
        Bundle extras = intent.getExtras();
        if (extras != null) {
          return new HeadlessJsTaskConfig(
              "BackgroundTask",
              Arguments.fromBundle(extras),
              5000, // timeout for the task
              false // optional: defines whether or not  the task is allowed in foreground. Default is false
            );
        }
        return null;
    }
}
