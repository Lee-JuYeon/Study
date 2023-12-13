package com.cavss.studycompose.secure

import android.util.Log
import java.lang.Exception

object ZygoteInit {

    /**
     * Register AndroidKeyStoreProvider and warm up the providers that are already registered.
     *
     * By doing it here we avoid that each app does it when requesting a service from the
     * provider for the first time.
     */
    fun warmUpJcaProviders() {
        // AndroidKeyStoreProvider.install() manipulates the list of JCA providers to insert
        // preferred providers. Note this is not done via security.properties as the JCA providers
        // are not on the classpath in the case of, for example, raw dalvikvm runtimes.
        try {
            AndroidKeyStoreProvider.install()
        }catch (e:Exception){
            Log.d("Cipher","ZygoteInit, warmUpJCAProviders 설정 중 Exception : ${e.message}")
        }
    }

}