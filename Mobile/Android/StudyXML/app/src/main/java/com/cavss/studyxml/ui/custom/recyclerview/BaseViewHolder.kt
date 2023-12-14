package com.cavss.studyxml.ui.custom.recyclerview

import android.util.Log
import androidx.databinding.ViewDataBinding
import androidx.recyclerview.widget.RecyclerView

abstract class BaseViewHolder<MODEL : Any, BIND : ViewDataBinding>(
    protected var binding : BIND // 하위 클래스에서 접근 가능하도록 protected 키워드 사용. private 사용시 접근불가.
) : RecyclerView.ViewHolder(binding.root){
    /*
    Viewholder에서 클릭이벤트를 처리하기 위해 코루틴 등을 사용하게 되면,
    새로운 스레드를 만들지 않고 기존 스레드를 재활용하여 효율적으로 처리할 수 있다.
    그치만 ViewHolder 특성상 객체가 많이 생성되고 해체되기 때문에 메모리가 낭비된다.

    따라서 동작 이벤트는 코루틴 대신 CallBack interface를 사용하여
    적은 메모리를 사용하고 메모리 누수를 방지할 수 있다.
     */
//    abstract fun bind(model: MODEL?, position : Int, clickListener: ViewHolderClickListener<MODEL>?)

    fun bindVariable(variableList : List<Pair<Int, Any>>?){
        try{
            variableList?.forEach {
                binding.setVariable(it.first, it.second)
            }
            binding.executePendingBindings()
            Log.d("mDebug", "BaseViewHolder, bindVariable // bindVariable success")
        }catch (e:Exception){
            Log.e("mException", "BaseViewHolder, bindVariable // Exception : ${e.localizedMessage}")
        }

    }
}

/*
class ExampleViewHolder(
    private val binding: ItemExampleBinding,
    listener: ItemClickListener<ExampleItem>?
) : BaseViewHolder<ExampleItem, ItemExampleBinding>(binding, listener) {

    override fun bind(item: ExampleItem) {
        binding.tvTitle.text = item.title
        binding.tvDescription.text = item.description
        binding.root.setOnClickListener { setItemClickListener(item) }
    }

    fun setOnClick(model : MODEL){
        try{
            val position = bindingAdapterPosition
            /*
            bindingAdapterPosition의 값이 -1일 경우의 대비해서 0보다 크거나 같다는 조건을 걸었다.
             */
            if (position != RecyclerView.NO_POSITION && position >= 0){
                clickListener?.onItemClick(model, position)
                Log.d("mDebug", "BaseViewHolder, setOnClick // click success")
            }else{
                Log.e("mException", "BaseViewHolder, setOnClick // Exception : RecyclerView.NO_POSITION")
            }
        }catch (e:Exception){
            Log.e("mException", "BaseViewHolder, setOnClick // Exception : ${e.localizedMessage}")
        }catch (e:IndexOutOfBoundsException) {
            Log.e("mException", "BaseViewHolder, setOnClick // IndexOutOfBoundsException : ${e.localizedMessage}")
        }
    }
}
 */