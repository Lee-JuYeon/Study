package com.cavss.studyxml.server.api

import com.google.gson.JsonElement
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Query

interface IRetrofit{
    // https://www.unsplash.com/ search/photos  /?query=""
    @GET(API.query_SearchPhotos)
    fun searchPhotos(@Query("query") search : String) : Call<JsonElement>

}