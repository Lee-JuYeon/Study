package com.cavss.studyxml.server.api
import android.util.Log.e
import com.cavss.studyxml.utils.extensions.Strings.isJsonArray
import com.cavss.studyxml.utils.extensions.Strings.isJsonObject
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import org.json.JSONObject
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

//싱글턴
object RetrofitClient {
    // 레트로핏 클라이언트 선언
    private var retrofitClient : Retrofit? = null

    // 레트로핏 클라이언트 가져오기
    fun getCLient(baseURL : String) : Retrofit?{

        //okhttp 인스턴스 생성
        val okhttpInstance = OkHttpClient.Builder()

        // 로그를 찍기 위해 Logging Inceptor추가
        val loggingInterceptor = HttpLoggingInterceptor(object : HttpLoggingInterceptor.Logger{
            override fun log(message: String) {
                when{
                    message.isJsonObject() -> e("mException", "JsonObject : ${JSONObject(message).toString(4)}")
                    message.isJsonArray() -> e("mException", "JsonArray : ${JSONObject(message).toString(4)}")
                    else -> {
                        try {
                            e("mException", "Log(String) : ${JSONObject(message).toString(4)}")
                        }catch (e:Exception){
                            e("mException", "except : ${e.message}")
                        }
                    }
                }
            }
        })
        loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY)
        okhttpInstance.addInterceptor(loggingInterceptor)

        // 기본 파라미터 추가
        val baseParameterInterceptor : Interceptor = (object  : Interceptor{
            override fun intercept(chain: Interceptor.Chain): Response {
                // 오리지널 리퀘스트
                val originalRequest = chain.request()

                // 퀴리 파라메터 추가하기.
                val addedUrl = originalRequest.url.newBuilder()
                    .addQueryParameter("client_id", API.accessKEY)
                    .build()

                val finalRequest = originalRequest.newBuilder()
                    .url(addedUrl)
                    .method(originalRequest.method, originalRequest.body)
                    .build()

                val reponse = chain.proceed(finalRequest)
                if (reponse.code != 200){
                    e("mException", "RetrofitClient, baseParameterInterceptor, response.code = ${reponse.code}")
                }
                return reponse
            }
        })
        // 위에서 설정한 기본 파라미터 인터셉터를 okhttp 클라이언트에 추가된다ㅣ.
        okhttpInstance.addInterceptor(baseParameterInterceptor)
        okhttpInstance.let {
            it.connectTimeout(10, TimeUnit.SECONDS)
            it.readTimeout(10, TimeUnit.SECONDS)
            it.writeTimeout(10, TimeUnit.SECONDS)
            it.retryOnConnectionFailure(true)
        }


        if (retrofitClient == null){
            // 레트로핏 필터를 통해 인스턴스 생성
            retrofitClient = Retrofit.Builder()
                .baseUrl(baseURL)
                .addConverterFactory(GsonConverterFactory.create())
                // 위에서 설정한 클라이언트로 retrofit2 클라이언트를 설정한다.
                .client(okhttpInstance.build())
                .build()
        }
        return retrofitClient
    }

}