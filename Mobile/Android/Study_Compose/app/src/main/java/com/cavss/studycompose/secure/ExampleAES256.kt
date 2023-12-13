package com.cavss.studycompose.secure


import android.app.Activity
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.app.ActivityCompat.shouldShowRequestPermissionRationale
import androidx.core.content.PermissionChecker.checkSelfPermission
//import androidx.fragment.app.FragmentActivity
import android.Manifest
import androidx.core.app.ActivityCompat
import androidx.core.content.PermissionChecker

class ExampleAES256 {

//    private var context: FragmentActivity? = null
//    fun setContext(setContext : FragmentActivity){
//        this.context = setContext
//    }
//
//    fun testInFragment(){
//        val requestPermissionLauncher =
//            context?.registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted: Boolean ->
//                if (isGranted) {
//                    // 권한이 허용된 경우, 키스토어를 이용한 암복호화 작업 수행
//                    val encryptText = AESHelper.encrypt("암호화 할 텍스트".toByteArray(Charsets.UTF_8))
//                    val decryptText = String(AESHelper.decrypt(encryptText)!!, Charsets.UTF_8)
//                    Log.e("mDebug", "암호화 된 텍스트 : ${encryptText}")
//                    Log.e("mDebug", "복호화 된 텍스트 : ${decryptText}")
//                } else {
//                    // 권한이 거부된 경우
//                }
//            }
//
//        if (checkSelfPermission(context!!, Manifest.permission.USE_BIOMETRIC) != PermissionChecker.PERMISSION_GRANTED) {
//            if (shouldShowRequestPermissionRationale(context!!, Manifest.permission.USE_BIOMETRIC)) {
//                //생체 인증은 권한이 필요합니다
//                requestPermissionLauncher?.launch(Manifest.permission.USE_BIOMETRIC)
//            }
//        } else {
//            // 인증 권한을 이미 사용자로부터 허용받았다
//            val encryptText = AESHelper.encrypt("암호화 할 텍스트".toByteArray(Charsets.UTF_8))
//            val decryptText = String(AESHelper.decrypt(encryptText)!!, Charsets.UTF_8)
//            Log.e("mDebug", "암호화 된 텍스트 : ${encryptText}")
//            Log.e("mDebug", "복호화 된 텍스트 : ${decryptText}")
//        }
//    }

}