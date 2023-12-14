package com.cavss.studyxml.ui.screen.menu

enum class Menu(val rawValue : String) {
    RecyclerView("RecyclerView"),
//    LocationBasedAR("LocationBasedAR"),
    BottomNavigation("BottomNavigation"),
    Fragment("Fragment"),
    ViewPager2("ViewPager2"),
    GridView("GridView"),
    Blur("Blur");

    override fun toString(): String {
        return rawValue
    }
}