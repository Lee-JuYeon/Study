package com.cavss.studyxml.ui.custom.bottomnavigtion

import android.content.res.ColorStateList
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.core.content.ContextCompat
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.cavss.studyxml.R
import com.cavss.studyxml.databinding.FragmentBottomnaviBinding
import com.google.android.material.bottomnavigation.BottomNavigationView

class FragBottomNavi : Fragment() {

    /*
    ViewMoodelProvider을 사용하지 않아도 자식 fragment들과 VM을 공유가 가능하다.
    만약 ViewModelProvider 사용하고 싶다면
     private val vm : VM by lazy {
        ViewModelProvider(requireActivity()).get(VM::class.java)
    }
     */
    private val bottomNaviVM : BottomNavigationVM by activityViewModels()
    private lateinit var binding : FragmentBottomnaviBinding

    private val fragA = FragA()
    private val fragB = FragB()
    private fun changeFragment(page : Int){
        try{
            val manager = requireActivity().supportFragmentManager.beginTransaction()
            when(page){
                0 -> manager.replace(binding.bottomNaviFrame.id, fragA).commit()
                1 -> manager.replace(binding.bottomNaviFrame.id, fragB).commit()
            }
        }catch (e:Exception){
            Log.e("mException", "FragBottomNavi, changeFragment  // Exception : ${e.message}")
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        try{
            binding = DataBindingUtil.inflate(inflater, R.layout.fragment_bottomnavi, container, false)
            binding.run{
                setBottomNavigation(bottomNavigation, bottomNaviFrame)
                setNeumorphismOnBottomNavi(bottomNavigation)
            }
        }catch (e:Exception){
            Log.e("mException", "FragBottomNavi, onCreateView // Exception : ${e.message}")
        }finally {
            return binding.root
        }
    }
    private fun setNeumorphismOnBottomNavi(bottomNavi: BottomNavigationView){
        try{
            bottomNavi.apply {
                // Bottom Navigation의 배경에 bottomnavi_neumorphic.xml 파일을 적용합니다.
//                setBackgroundResource(R.drawable.bottomnavi_neumorphic_inside)

                // Bottom Navigation의 아이콘에 Neumorphism 디자인을 적용합니다.
//                itemIconTintList =  ColorStateList.valueOf(ContextCompat.getColor(requireContext(), R.color.purple_200))

                // Bottom Navigation의 텍스트에 Neumorphism 디자인을 적용합니다
//                itemTextColor = ColorStateList.valueOf(ContextCompat.getColor(requireContext(), R.color.purple_500))

            }
        }catch (e:Exception){
            Log.e("mException", "FragBottomNavi, setNeumorphismOnBottomNavi // Exception : ${e.localizedMessage}")
        }
    }
    private fun setBottomNavigation(bottomNavi : BottomNavigationView, frame : FrameLayout){
        try{
            bottomNavi.setOnItemSelectedListener { menuItem ->
                when (menuItem.title) {
                    requireContext().getString(R.string.bottom_navi_item1) -> {
                        // Fragment a로 이동
                        bottomNaviVM.setFragmentType(0)
                        true
                    }
                    requireContext().getString(R.string.bottom_navi_item2) -> {
                        // Fragment b로 이동
                        bottomNaviVM.setFragmentType(1)
                        true
                    }
                    else -> {
                        bottomNaviVM.setFragmentType(0)
                        false
                    }
                }
            }
            bottomNaviVM.getFragmentType.observe(requireActivity()){ page : Int ->
                try {
                    changeFragment(page)
                } catch (e: Exception) {
                    changeFragment(0)
                    Log.e("mException", "FragBottomNavi, onCreate, bottomNaviVM.getFragmentType.observe // Exception : ${e.message}")
                } catch (e: NoSuchElementException) {
                    changeFragment(0)
                    Log.e("mException","FragBottomNavi, onCreate, bottomNaviVM.getFragmentType.observe  // NoSuchElementException : ${e.message}")
                }
            }
        }catch (e:Exception){
            Log.e("mException", "FragBottomNavi, setBottomNavigation // Exception : ${e.localizedMessage}")
        }
    }

    override fun onStart() {
        super.onStart()

    }


    override fun onDestroy() {
        try{
            super.onDestroy()
        }catch (e:Exception){
            Log.e("mException", "FragBottomNavi, onDestroy // Exception : ${e.localizedMessage}")
        }
    }
}