package com.cavss.studyxml

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.ViewModelProvider
import com.cavss.studyxml.databinding.ActivityMainBinding
import com.cavss.studyxml.ui.screen.menu.MenuVM
import com.cavss.studyxml.ui.custom.bottomnavigtion.FragBottomNavi
import com.cavss.studyxml.ui.screen.menu.FragMenu
import com.cavss.studyxml.ui.screen.menu.Menu
import com.cavss.studyxml.ui.screen.menu.Menu.*


class MainActivity : AppCompatActivity() {
    /*
       'private lateinit var menuVM : MenuVM' 대신 'private var menuVM by viewModels<MenuVM>' 을 사용한 이유.
       1. Null 안정성 :
           'lateinit'을 사용하면 VM이 초기화 되지 않은 경우 Exception발생.
           반대로 by viewModels는 null safety하며, VM이 초기화 되지 않은 경우 시스템이 자동적으로 새 인스턴스를 생성.
       2. 코드 간소화 : VM의 인스턴스를 생성하고 관리하는 코드를 간소화 할 수 있으며 VM의 생명주기를 더 쉽게 관리.
       3. 범용성 : Dagger와 같은 의존성 주입 프레임워크를 사용하여 VM을 주입가능.

        */
    private var menuVM : MenuVM? = null
    private lateinit var binding: ActivityMainBinding

    private val fragMenu = FragMenu()
//    private val fragAR = FragLocationBasedAR()
    private val fragBottomNavi = FragBottomNavi()
    private fun changeFragment(frag : Menu){
        try{
            val manager = (this as FragmentActivity).supportFragmentManager.beginTransaction()
            when(frag){
                RecyclerView -> manager.replace(binding.frame.id, fragMenu).commit()
//                LocationBasedAR -> manager.replace(binding.frame.id, fragAR).commit()
                BottomNavigation -> manager.replace(binding.frame.id, fragBottomNavi).commit()
                Fragment -> manager.replace(binding.frame.id, fragMenu).commit()
                ViewPager2 -> manager.replace(binding.frame.id, fragMenu).commit()
                GridView -> manager.replace(binding.frame.id, fragMenu).commit()
                Blur -> manager.replace(binding.frame.id, fragMenu).commit()
            }
        }catch (e:Exception){
            Log.e("mException", "MainActivity, changeFragment  // Exception : ${e.message}")
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_main)
        binding.run{

        }

        /*
        자식 Fragment들과 같은 인스턴스를 가진 VM을 공유하기 위해선
        ViewModelProvider을 사용하여 Activity에서 선언해주어야한다.
        그리고 자식 Fragment에선 vm : VM by activityViewModles() 메소드를 사용하여 공유받도록한다.

        viewModels()는 ViewModelProvider의 확장함수로 사용되는 범위가
        'Fragment', 'FragmentActivity'와 같은 범위 내에서 제한된다.
        따라서 viewModels()함수를 사용하여 생성된 VM은, 해당 VM을 선언한 Fragment 내부에서만 공유됨.
         */
        menuVM = ViewModelProvider(this@MainActivity).get(MenuVM::class.java)
        menuVM?.getFragmentType?.observe(this@MainActivity) { type ->
            try {
                changeFragment(type)
            } catch (e: Exception) {
                changeFragment(RecyclerView)
                Log.e("mException", "MainActivity, onCreate, menuVM.getFragmentType.observe // Exception : ${e.message}")
            } catch (e: NoSuchElementException) {
                changeFragment(RecyclerView)
                Log.e("mException","MainActivity, onCreate, menuVM.getFragmentType.observe  // NoSuchElementException : ${e.message}")
            }
        }
        setContentView(binding.root)
    }




    override fun onStart() {
        super.onStart()

    }

    override fun onDestroy() {
        super.onDestroy()
    }
}