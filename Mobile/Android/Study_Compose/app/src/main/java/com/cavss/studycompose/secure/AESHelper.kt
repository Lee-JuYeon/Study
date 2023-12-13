package com.cavss.studycompose.secure

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Log
import com.cavss.studycompose.BuildConfig
import java.io.IOException
import java.security.*
import java.security.cert.CertificateException
import java.security.spec.InvalidKeySpecException
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.IvParameterSpec


object AESHelper {
    /** 키를 외부에 저장할 경우 유출 위험이 있으니까 소스 코드 내에 숨겨둔다. 길이는 16자여야 한다. */
    private val KEY_ALIAS = BuildConfig.aes_key // 키스토어 에서 사용할 별칭
    private const val AndroidKeyStore = "AndroidKeyStore"
    private const val CIPHER_TRANSFORMATION = "AES/CBC/PKCS7Padding"

    /*
    키스토어 암호화할때 map으로 return했기 떄문에 파라미터는 HashMap으로 해야한다.
    return 은 원래 String(kenyEncrypt파라미터는 String을 받아서 ByteArray로 변환했다.)값으로
    받도록 ByteArray로 해야한다.
    */
//    fun encrypt(dataToEncrypt : ByteArray) : HashMap<String, ByteArray>{
//        val map = HashMap<String, ByteArray>()
//        try {
//            //Get the key
//            val keyStore = KeyStore.getInstance(AndroidKeyStore)
//            keyStore.load(null)
//
//            val secretKeyEntry = keyStore.getEntry(KEY_ALIAS, null) as KeyStore.SecretKeyEntry
//            val secretKey = secretKeyEntry.secretKey
//
//            //Encrypt data
//            val cipher = Cipher.getInstance(CIPHER_TRANSFORMATION)
//            cipher.init(Cipher.ENCRYPT_MODE, secretKey)
//
//            val ivBytes = cipher.iv
//
//            val encryptedBytes = cipher.doFinal(dataToEncrypt)
//
//            map["iv"] = ivBytes
//            map["encrypted"] = encryptedBytes
//        }catch (e: Exception){
//            Log.d("mException", "keystore 암호화 하는 도중 : ${e.message}")
//        }finally {
//            return map
//        }
//    }
//
//    fun decrpyt(map: HashMap<String, ByteArray>) : ByteArray?{
//        var decrypted: ByteArray? = null
//        try {
//            // 1
//            //Get the key
//            val keyStore = KeyStore.getInstance(AndroidKeyStore)
//            keyStore.load(null)
//
//            val secretKeyEntry = keyStore.getEntry(KEY_ALIAS, null) as KeyStore.SecretKeyEntry
//            val secretKey = secretKeyEntry.secretKey
//
//            // 2
//            //Extract info from map
//            val encryptedBytes = map["encrypted"]
//            val ivBytes = map["iv"]
//
//            // 3
//            //Decrypt data
//            val cipher = Cipher.getInstance(CIPHER_TRANSFORMATION)
////            val spec = GCMParameterSpec(128, ivBytes)
//            val ivParams = IvParameterSpec(ivBytes)
////            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec)
//            cipher.init(Cipher.DECRYPT_MODE, secretKey, ivParams)
//            decrypted = cipher.doFinal(encryptedBytes)
//        } catch (e: Exception) {
//            Log.d("mException","AESHelper, keystore decrypt 중 Exception : ${e.message}")
//        } catch (e: Throwable) {
//            Log.d("mException","AESHelper, keystore decrypt 중 Throwable : ${e.message}")
//        }finally {
//            return decrypted
//        }
//    }


    fun encrypt(dataToEncrypt : ByteArray) : HashMap<String, ByteArray>{
        val map = HashMap<String, ByteArray>()
        try {
            //Get the key
            val keyStore = KeyStore.getInstance("AndroidKeyStore")
            keyStore.load(null)

            val secretKeyEntry = keyStore.getEntry("Sample Keystore Alias. 원하는 텍스트로 변환 가능.", null) as KeyStore.SecretKeyEntry
            val secretKey = secretKeyEntry.secretKey

            //Encrypt data
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(Cipher.ENCRYPT_MODE, secretKey)
            val ivBytes = cipher.iv
            val encryptedBytes = cipher.doFinal(dataToEncrypt)

            map["iv"] = ivBytes
            map["encrypted"] = encryptedBytes
        }catch (e: Exception){
            Log.e("mException", "keystore 암호화 하는 도중 : ${e.message}")
        }finally {
            return map
        }
    }
    /*
     키스토어 암호화할때 map으로 return했기 떄문에 파라미터는 HashMap으로 해야한다.
     return 은 원래 String(kenyEncrypt파라미터는 String을 받아서 ByteArray로 변환했다.)값으로
     받도록 ByteArray로 해야한다.
     */
    fun decrypt(map: HashMap<String, ByteArray>) : ByteArray?{
        var decrypted: ByteArray? = null
        try {
            // 1
            //Get the key
            val keyStore = KeyStore.getInstance("AndroidKeyStore")
            keyStore.load(null)

            val secretKeyEntry = keyStore.getEntry("Sample Keystore Alias. 원하는 텍스트로 변환 가능.", null) as KeyStore.SecretKeyEntry
            val secretKey = secretKeyEntry.secretKey

            // 2
            //Extract info from map
            val encryptedBytes = map["encrypted"]
            val ivBytes = map["iv"]

            // 3
            //Decrypt data
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            val spec = GCMParameterSpec(128, ivBytes)
            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec)
            decrypted = cipher.doFinal(encryptedBytes)
        } catch (e: Exception) {
            Log.e("mException","AESHelper, keystore decrypt 중 Exception : ${e.message}")
        } catch (e: Throwable) {
            Log.e("mException","AESHelper, keystore decrypt 중 Throwable : ${e.message}")
        }finally {
            return decrypted
        }
    }



    fun keystoreTest(testMessage : String, afterFunc : (decrypted : String) -> Unit) {
        try {
            keystoreSetting()
            val map = encrypt(testMessage.toByteArray(Charsets.UTF_8))
            val decryptedData = decrypt(map)
            decryptedData?.let{
                val decryptedString = String(it, Charsets.UTF_8)
                afterFunc(decryptedString)
            }
        }catch (e: Exception){
            Log.e("mException", "keystore 테스트 하는 도중 : ${e.message}")
        }catch (e: InvalidKeySpecException) {
            Log.e("mException", "keystore 테스트 하는 도중 키를 못가져옴 : ${e.message}")
        }
    }

    fun keystoreSetting(){
        try {
            val prepareKey = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
            val keyCharacter = KeyGenParameterSpec.Builder("Sample Keystore Alias. 원하는 텍스트로 변환 가능.",
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setRandomizedEncryptionRequired(true) //KeyStore에 매번 새로운 IV를 사용
//                .setUserAuthenticationRequired(true) -> 잠금화면 설정. 화면 잠금 요구사항을 활성화할때 사용자가 잠금화면, pin, 암호를 제거하거나 변경하면 키가 바로 취소된다.
//                .setUserAuthenticationValidityDurationSeconds(120) -> 장치 인증 후 120초 동안 키를 사용할 수 있다. 키에 엑세스 할 때마다 지문 인증이 필요하도록 -1을 전달한다.
                .build()

            // make Key
            prepareKey.init(keyCharacter)
            prepareKey.generateKey()
        }catch (e: Exception){
            Log.e("mException", "keystore 테스트 하는 도중 : ${e.message}")
        }
    }
}