package com.cavss.studyxml.extension

object Strings {
    val search : String = "검색"

    // 문자열이 제이슨 형태인지
    fun String?.isJsonObject():Boolean {
        return this?.startsWith("{") == true && this.endsWith("}")
//    return this?.startsWith("{") == true && this.endsWith("}")
    }
//fun String?.isJsonObject():Boolean = this?.startsWith("{") == true && this.endsWith("}")

    // 문자열이 제이슨 배열인지
    fun String?.isJsonArray() : Boolean {
        return this?.startsWith("[") == true && this.endsWith("]")
    }

}