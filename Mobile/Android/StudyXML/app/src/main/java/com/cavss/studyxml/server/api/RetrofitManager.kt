package com.cavss.studyxml.server.api

import android.util.Log.e
import com.google.gson.JsonElement
import retrofit2.Call
import retrofit2.Response
import java.text.SimpleDateFormat

class RetrofitManager {
    companion object {
        val instance = RetrofitManager()
    }

    // http 콜 만들기
    private val iRetrofit : IRetrofit? = RetrofitClient.getCLient(API.UNSPLASH_URL)?.create(IRetrofit::class.java)

    // 사진검색 api호출
    fun searchPhotos(search : String?, completion : (ArrayList<PhotoModel>) -> Unit){
        val imageFileTitle = search ?: ""
        val call = iRetrofit?.searchPhotos(search = imageFileTitle) ?: return

        call.enqueue(object : retrofit2.Callback<JsonElement>{
            var parsedPhotoDataArray = ArrayList<PhotoModel>()
            override fun onFailure(call: Call<JsonElement>, t: Throwable) {
                parsedPhotoDataArray.add(
                    PhotoModel(
                        author = "에러 어질어질하네…",
                        likesCount = 0,
                        thumnail =  "에러 어질어질하네…",
                        createdAt =  "에러 어질어질하네…"
                    )
                )
                completion(parsedPhotoDataArray)
                e("mException", "RetrofitManager, searchPhotos, onFailure // Throwable : ${t.message}")
            }

            override fun onResponse(call: Call<JsonElement>, response: Response<JsonElement>) {
                when(response.code()){
                    200 -> {
                        response.body()?.let {
                            val body = it.asJsonObject
                            val results = body.getAsJsonArray("results")
                            val total = body.get("total").asInt

                            if (total == 0){
                                parsedPhotoDataArray.add(
                                    PhotoModel(
                                        author = "쩝… 데이터가 없네요… 서운하네",
                                        likesCount = 0,
                                        thumnail =  "쩝… 데이터가 없네요… 서운하네",
                                        createdAt =  "쩝… 데이터가 없네요… 서운하네"
                                    )
                                )
                            }else{
                                results.forEach { resultItem ->
                                    val resultItemObject = resultItem.asJsonObject
                                    val user = resultItemObject.get("user").asJsonObject
                                    val userName = user.get("username").asString
                                    val likesCount = resultItemObject.get("likes").asInt
                                    val thumbnailLink = resultItemObject.get("urls").asJsonObject.get("thumb").asString
                                    val createdAt = resultItemObject.get("created_at").asString

                                    val parse = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                                    val formatter = SimpleDateFormat("yyyy년 \nMM월 dd일")
                                    val getKoreanTypeDate = formatter.format(parse.parse(createdAt))

                                    val photoItem = PhotoModel(
                                        author = userName,
                                        likesCount = likesCount,
                                        thumnail = thumbnailLink,
                                        createdAt = getKoreanTypeDate
                                    )
                                    parsedPhotoDataArray.add(photoItem)
                                }
                            }
                            completion(parsedPhotoDataArray)
                        }
                    }
                }
            }
        })
    }
}