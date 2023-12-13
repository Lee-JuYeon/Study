package com.cavss.studycompose

import android.app.Application
import com.cavss.studycompose.secure.AESHelper
import com.cavss.studycompose.secure.ZygoteInit

class App : Application() {
    init {
        INSTANCE = this
    }

    // 여기다 코드 추가. 다른곳에 할 경우, 스래드 오류발생
    override fun onCreate() {
        super.onCreate()
        ZygoteInit.warmUpJcaProviders()
        AESHelper.keystoreSetting()
    }

    companion object {
        lateinit var INSTANCE: App
    }
}
/*
안드로이드 면접 관련 :
https://hyeonu1258.github.io/2018/03/26/%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C%20%EB%A9%B4%EC%A0%91/
뷰페이저2 관련 :
https://blog.gangnamunni.com/post/viewpager2
쿼리 관련 :
  @Dao
    interface UserDao {
        @Query("SELECT * FROM user WHERE birthday BETWEEN :from AND :to")
        fun findUsersBornBetweenDates(from: Date, to: Date): List<User>
    }
    https://adrianhall.github.io/android/2018/08/08/converting-types-with-room-and-kotlin/
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun upsertByReplacement(image: List<ImageTest>)
    @Query("SELECT * FROM image")
    fun getAll(): List<ImageTest>
    @Query("SELECT * FROM image WHERE id IN (:arg0)")
    fun findByIds(imageTestIds: List<Int>): List<ImageTest>
    @Delete
    fun delete(imageTest: ImageTest)
shared preference, 암호화 관련 :
https://android.jlelse.eu/android-observe-shared-preferences-as-livedata-27e25e7d3172
https://dev.to/doodg/sharedprefrences-becomes-live-with-live-data-545g
https://developer.android.com/guide/topics/security/cryptography?hl=ko
https://developer.android.com/topic/security/data?hl=ko
 메모리 내에 plaintext 형태로 존재하는 attack surface 를 소멸시켜 준다.
        secretKey.fill(0, 0, secretKey.size - 1)
        CharArray(dbPassBytes.size, { i -> dbPassBytes[i].toChar() })
이미지 shared preference에 저장 :
https://stackoverflow.com/questions/46337519/how-insert-image-in-room-persistence-library/46356934
이미지 사이즈 줄이기 :
https://stackoverflow.com/questions/37873380/how-to-reduce-image-size-into-1mb
오디오 관련 :
https://gooners0304.tistory.com/entry/%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C-KeyStore-%EB%B9%84%EB%8C%80%EC%B9%AD-%EC%95%94%ED%98%B8%ED%99%94
https://unikys.tistory.com/350
https://link2me.tistory.com/1328
https://pyxispub.uzuki.live/?p=342
https://link2me.tistory.com/1350?category=1019573
https://www.python2.net/questions-437620.htm
http://dktfrmaster.blogspot.com/2016/10/mediastore.html
프래그먼트 데이터전달 :
https://terry-some.tistory.com/21
mysql 암호화 :
http://thinkdiff.net/mysql/encrypt-mysql-data-using-aes-techniques/
 */