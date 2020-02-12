package com.wetdog.babyhelper;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.vydia.RNUploader.UploaderReactPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
//Firebase
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
//Finde Firebase
import com.sbugert.rnadmob.RNAdMobPackage;
import com.reactlibrary.RNThumbnailPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.devialab.exif.RCTExifPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
//import com.horcrux.svg.SvgPackage;
import com.rnfs.RNFSPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import cl.json.RNSharePackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.smixx.fabric.FabricPackage;
import java.util.Arrays;
import java.util.List;

import android.app.job.JobInfo;
import android.app.job.JobScheduler;
import android.content.ComponentName;
import android.content.Context;
import android.util.Log;


public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
            new UploaderReactPackage(),
                new RNGoogleSigninPackage(),
                new RNFirebasePackage(),
                new RNFirebaseMessagingPackage(),
                new RNFirebaseNotificationsPackage(),
                //new SvgPackage(),
                new RNAdMobPackage(),
                new RNThumbnailPackage(),
                new ReactVideoPackage(),
                new RCTExifPackage(),
                new OrientationPackage(),
                new RNDeviceInfo(),
                new RNFSPackage(),
                new RNI18nPackage(),
                new VectorIconsPackage(),
                new RNSharePackage(),
                new PickerPackage(),
                new RNFetchBlobPackage(),
                new FabricPackage()
          );
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Fabric.with(this, new Crashlytics());
        SoLoader.init(this, /* native exopackage */ false);

        /**
        NO ESTA EN USO LO MANTENEMOS COMO EJEMPLO.
        Ejemplo de código nativo para integrar con React-Native
        Mirar el código de react-native-background-task para ver como se integra un módulo
        Log.d(TAG,"Configurando JobScheduler");
        JobScheduler js = (JobScheduler) getApplicationContext().getSystemService(Context.JOB_SCHEDULER_SERVICE);
        JobInfo job = new JobInfo.Builder(
            MY_BACKGROUND_JOB,
            new ComponentName(getApplicationContext(), BackgroundTaskService.class))
            .setPeriodic(900000)
            .build();
        //.setRequiredNetworkType(JobInfo.NETWORK_TYPE_UNMETERED)
        //.setRequiresCharging(true)
        js.schedule(job);
        **/
    }

}
