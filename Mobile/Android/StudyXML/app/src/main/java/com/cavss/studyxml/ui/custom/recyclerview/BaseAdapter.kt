package com.cavss.studyxml.ui.custom.recyclerview

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.databinding.ViewDataBinding
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView

abstract class BaseAdapter{

    abstract class Adapter<MODEL : Any, BIND : ViewDataBinding>() : RecyclerView.Adapter<BaseViewHolder<MODEL, BIND>>(){
//        protected var clickListener: ViewHolderClickListener<MODEL>? = null
//        fun setOnClickListener(listener: ViewHolderClickListener<MODEL>) {
//            clickListener = listener
//        }

        private val items = mutableListOf<MODEL>()
        //        abstract fun getDiffUtil(oldList: List<MODEL>, newList: List<MODEL>) : BaseDiffUtil<MODEL>
        fun updateList(newItems : List<MODEL>?){
            try{
                val diffResult = DiffUtil.calculateDiff(
                    object : BaseDiffUtil<MODEL>(
                        oldList = items,
                        newList = newItems ?: mutableListOf()
                    ){},
                    false
                )

                diffResult.dispatchUpdatesTo(this)
                items.clear()
                items.addAll(newItems ?: mutableListOf())

                Log.d("mDebug", "BaseAdapter, updateList // updateList success")
            }catch (e:Exception){
                Log.e("mException", "BaseAdapter, updateList // Exception : ${e.message}")
            }
        }

        /*
        클릭 리스너. onCreateViewHolder에 달아야 할까? 아니면 onBindViewHolder에 달아야할까?
        답은 '동적으로 변경될 가능성'에 있다.
        onCreateViewHolder가 Item이 최초 생성될 때 호출되기 때문에 뷰가 생성되는 시점에서
        리스너를 설정할 수 있기 때문에 리스너가 변경될 일이 없다면, onCreateViewHolder에 달아주는게 적합하며,
        반대로 클릭 리스너가 동적으로 변경될 가능성이 있다면 onBindViewHolder에 리스너를 달아주는게 적합하다.

        그러면 '클릭 리스너가 동적으로 변경될 가능성'이란건 뭘까? 리스너의 구현이나 동작 방식이 변경될 가능성을 말한다.
        예를 들어, 처음에는 아이템 전체를 클릭할 때 상세 페이지로 이동하는 기능을 가진 클릭 리스너를 사용하다가
        나중에는 아이템 내의 특정 버튼을 클릭했을 때만 상세 페이지로 이동하는 기능을 가진 클릭 리스너로 변경할 수 있다는 것.

        메모리에 영향을 미칠까?
        onCreateViewHolder에 적용하면 viewholder가 생성될 때마다 리스너를 새로 생성해야 하지만,
        onBindViewHolder에 적용하면 viewHolder객체를 재사용하므로 메모리 소모가 적다.
        하지만, onBindViewHolder가 호출될 때마다 클릭 리스너를 새로 할당하기 때문에
        이벤트 처리에 살짝 더 많은 리소스를 필요로 할 수 있다.
        그리고 아이탬 갯수가 많으면 onBindViewholder에 적용하는게 더 용이하고,
        갯수가 적으면 onCreateViewHodler에 적용하는게 더 빠르다.
         */
//        abstract fun setViewHolderClass(binding: BIND): BaseViewHolder<MODEL, BIND>
        // viewholder의 xml파일을 넣는곳.
        abstract fun setViewHolderXmlFileName(viewType: Int): Int // TODO: ViewHolder의 XML파일을 넣는 곳.
        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BaseViewHolder<MODEL, BIND> {
            val binding : BIND = DataBindingUtil.inflate(
                LayoutInflater.from(parent.context),
                setViewHolderXmlFileName(viewType),
                parent,
                false
            )
            return object : BaseViewHolder<MODEL, BIND>(binding = binding){}
        }

        abstract fun setViewHolderVariable(position: Int, model : MODEL?) : List<Pair<Int, Any>>
        override fun onBindViewHolder(holder: BaseViewHolder<MODEL, BIND>, position: Int) {
            try{
                holder.let {
//                    it.bind(items[position], position, clickListener!!)
                    it.bindVariable(setViewHolderVariable(position, items[position]))
                    Log.d("mDebug", "BaseAdapter, onBindViewHolder // binding success")
                }
            }catch (e:Exception){
                Log.e("mException", "BaseAdapter, onBindViewHolder // Exception : ${e.message}")
            }
        }

        override fun getItemCount() = items.size

        override fun onViewRecycled(holder: BaseViewHolder<MODEL, BIND>) {
            try{
                super.onViewRecycled(holder)
                holder.let {
//                    it.bind(null, 0, null)
                    it.bindVariable(setViewHolderVariable(0, null))
                    Log.d("mDebug", "BaseAdapter, onViewRecycled // null success")
                }
            }catch (e:Exception){
                Log.e("mException", "BaseAdapter, onViewRecycled // Exception : ${e.message}")
            }
        }
    }
}