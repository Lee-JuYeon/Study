package com.cavss.studyxml.ui.custom.recyclerview

interface IViewHolderClick<MODEL> {
    fun onItemClick(model : MODEL, position : Int)

}