package com.wetdog.babyhelper;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import javax.annotation.Nullable;
import org.json.JSONObject;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "BabyHelper";
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }
}
