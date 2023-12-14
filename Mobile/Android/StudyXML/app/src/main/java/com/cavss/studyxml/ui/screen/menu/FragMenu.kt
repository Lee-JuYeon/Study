package com.cavss.studyxml.ui.screen.menu

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.viewModels
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.cavss.studyxml.BR
import com.cavss.studyxml.R
import com.cavss.studyxml.databinding.FragmentMenuBinding
import com.cavss.studyxml.databinding.ItemMainBinding
import com.cavss.studyxml.ui.custom.recyclerview.BaseAdapter
import com.cavss.studyxml.ui.custom.recyclerview.CustomItemGap
import com.cavss.studyxml.ui.custom.recyclerview.IViewHolderClick

class FragMenu : Fragment() {

    private val menuVM : MenuVM by activityViewModels()
    private lateinit var binding : FragmentMenuBinding

    override fun onCreateView( inflater: LayoutInflater,container: ViewGroup?,savedInstanceState: Bundle?): View? {
        try{
            binding = DataBindingUtil.inflate(inflater, R.layout.fragment_menu, container, false)
            binding.run{
                setMenuRecyclerView(menuRecyclerView)
            }
        }catch (e:Exception){
            Log.e("mException", "FragMenu, onCreateView // Exception : ${e.message}")
        }finally {
            return binding.root
        }
    }

    private var customAdapter : BaseAdapter.Adapter<MenuModel, ItemMainBinding>? = null
    private fun updateMenuList(newList : List<MenuModel>){
        try{
            customAdapter?.updateList(newList)
        }catch (e:Exception){
            Log.e("mException", "FragMenu, updateMenuList // Exception : ${e.message}")
        }
    }
    private fun setMenuRecyclerView(recyclerView : RecyclerView){
        try{
            val clickEvent = object : IViewHolderClick<MenuModel> {
                override fun onItemClick(model: MenuModel, position: Int) {
                    when(model.menu){
                        Menu.RecyclerView.rawValue -> {
                            menuVM.setFragmentType(Menu.RecyclerView)
                        }
                        Menu.LocationBasedAR.rawValue -> {
                            menuVM.setFragmentType(Menu.LocationBasedAR)
                        }
                        Menu.BottomNavigation.rawValue -> {
                            menuVM.setFragmentType(Menu.BottomNavigation)
                        }
                        Menu.Fragment.rawValue -> {
                            menuVM.setFragmentType(Menu.Fragment)
                        }
                        Menu.ViewPager2.rawValue -> {
                            menuVM.setFragmentType(Menu.ViewPager2)
                        }
                        Menu.GridView.rawValue -> {
                            menuVM.setFragmentType(Menu.GridView)
                        }
                        Menu.Blur.rawValue -> {
                            menuVM.setFragmentType(Menu.Blur)
                        }
                    }
                    Log.d("mDebug", "FragMenu, setMenuRecyclerView, ViewHolderClickListener // Debug : ${model.menu} clicked")
                }
            }

            customAdapter = object : BaseAdapter.Adapter<MenuModel, ItemMainBinding>(){
                override fun setViewHolderXmlFileName(viewType: Int): Int {
                    return R.layout.item_main
                }
                override fun setViewHolderVariable(position: Int,model: MenuModel?): List<Pair<Int, Any>> {
                    return listOf(
                        BR.model to model!!,
                        BR.position to position,
                        BR.clickCallback to clickEvent
                    )
                }
            }

            recyclerView.apply {
                adapter = customAdapter
                setHasFixedSize(true)
                layoutManager = LinearLayoutManager(requireActivity()).apply{
                    orientation = LinearLayoutManager.VERTICAL
                    isItemPrefetchEnabled = false
                }
                addItemDecoration(CustomItemGap(10))
                setItemViewCacheSize(0)
            }
        }catch (e:Exception){
            Log.e("mException", "FragMenu, setMenuRecyclerView // Exception : ${e.message}")
        }
    }


    override fun onStart() {
        super.onStart()

        menuVM.menuList.observe(requireActivity()){ list : List<MenuModel> ->
            updateMenuList(list)
        }
    }


    override fun onDestroy() {
        try{
            super.onDestroy()
            customAdapter = null
        }catch (e:Exception){
            Log.e("mException", "FragMenu, onDestroy // Exception : ${e.localizedMessage}")
        }
    }
}