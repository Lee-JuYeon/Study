package com.cavss.studyxml.ui.screen.menu

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class MenuVM() : ViewModel() {
    /*
    get, set을 사용한 이유 :
        isLoading 변수가 특정 메소드 등에 의해서 의도치 않게 변경되는 경우가 있다면, 앱이 예기치 않게 동작할 수 있다. (Exception이나 에러 발생가능성)
        따라서, get,set메서드를 사용하면 필요한 경우에만 변수에 접근할 수 있다.
     */
    private val _menuList = MutableLiveData(listOf<MenuModel>())
    val menuList: LiveData<List<MenuModel>>
        get() = _menuList

    fun setMenuList(newList: List<MenuModel>) {
        try {
            /*
            _menuList.value = newList 가 아닌
            _menuList.postValue(newList)를 사용한 이유?
            백그라운드 스래드에서 안전하게 LiveData값을 변경할 수 있다.
            반대로 setValue()를 사용하면 메인 스레드에서 안전하게 LiveData값을 변경할 수 있다.
            */
            _menuList.postValue(emptyList())
            _menuList.postValue(newList)
        } catch (e: Exception) {
            Log.e("mException", "MenuVM, setMenuList // Exception : ${e.localizedMessage}")
        }
    }

    private val fragmentType = MutableLiveData<Menu>(Menu.RecyclerView)
    fun setFragmentType(type : Menu){ fragmentType.postValue(type) }
    val getFragmentType : LiveData<Menu>
        get() = fragmentType


    init {
        setMenuList(
            listOf(
                MenuModel(Menu.RecyclerView.rawValue),
//                MenuModel(Menu.LocationBasedAR.rawValue),
                MenuModel(Menu.BottomNavigation.rawValue),
                MenuModel(Menu.Fragment.rawValue),
                MenuModel(Menu.ViewPager2.rawValue),
                MenuModel(Menu.GridView.rawValue),
                MenuModel(Menu.Blur.rawValue)
            )
        )

        setFragmentType(Menu.RecyclerView)
        Log.d("mDebug", "MenuVM, init // init on")
    }

    override fun onCleared() {
        super.onCleared()
        _menuList.postValue(emptyList())
    }
}

//    private val compositeDisposable = CompositeDisposable()
//    val data = repository.getData()
//        .subscribeOn(Schedulers.io())
//        .observeOn(AndroidSchedulers.mainThread())
//
//    fun loadData(){
//        viewModelScope.launch {
//            try {
//                val result = withContext(Dispatchers.IO) {
//                    repository.getData()
//                }
//                /*
//                _data.value = result 가 아닌
//                _data.postValue(result)를 사용한 이유?
//                    백그라운드 스래드에서 안전하게 LiveData값을 변경할 수 있다.
//                    반대로 setValue()를 사용하면 메인 스레드에서 안전하게 LiveData값을 변경할 수 있다.
//                 */
//                _data.postValue(result)
//            } catch (e: Exception) {
//                // 예외 처리
//            }
//        }
//    }


/*
    private var job: Job? = null
    private val _menuListSubject = BehaviorSubject.create<List<MenuModel>>()
    val menuList: Observable<List<MenuModel>>
        /*
        hide()는 _menuList를 구독하는 옵저가 항상 새로운 값을 받을 때만 알림을 받게 된다.
        _menuList에 새로운 값을 발행하지 않았다면 알림을 주지 않아 메모리를 덜 차지하고 불필요한 처리를 하지 않게된다.
        즉, 가장 최근의 이벤트만 발행하여 처리량을 줄이는 역할.
         */
        get() = _menuListSubject.hide()



    private fun loadMenuList() {
        job?.cancel()
        job = null
        job = viewModelScope.launch(Dispatchers.IO) {
            try {
                _menuListSubject.onNext(menuList)
            } catch (e: Exception) {
                // 에러 처리
                Log.e("mException", "MenuVM, loadMenuList // Excdeption : ${e.message}")
            }
        }
    }

    fun updateMenuList(newMenuList: List<MenuModel>) {
        _menuListSubject.onNext(newMenuList)
    }

    init{
        loadMenuList()
    }

    override fun onCleared(){
        super.onCleared()
        job?.cancel()
        job = null
    }
 */