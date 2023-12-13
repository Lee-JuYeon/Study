package com.cavss.studycompose.secure


import android.util.Log
import java.lang.Exception
import java.security.Provider
import java.security.Security

class AndroidKeyStoreProvider : Provider(PROVIDER_NAME, 1.0, "Android KeyStore security provider") {
    companion object {
        val PROVIDER_NAME = "AndroidKeyStore"

        // 새 provider를 생성함
        fun install() {
            try {
                if (Security.getProvider(PROVIDER_NAME) == null){
                    Log.d("Cipher","AndroidKeyStoreProvider, install // 프로바이더 설치")
                    Security.addProvider(AndroidKeyStoreProvider())
                }else if (Security.getProvider(PROVIDER_NAME) != null){
                    Log.d("Cipher","AndroidKeyStoreProvider, install // 프로바이더가 설치되어있음.")
                }
            }catch (e:Exception){
                Log.d("Cipher","AndroidKeyStoreProvider, install Exception : ${e.message}")
            }
        }
        fun supportedFunctions(){
            // 보안 provider 리스트
            for (p in java.security.Security.getProviders()) {
                println(String.format("== %s ==", p.name))
                for (s in p.services) {
                    println(String.format("- %s", s.algorithm))
                }
            }
        }
    }
}