package com.cavss.studyxml.ui.custom.bottomnavigtion


import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.cavss.studyxml.databinding.FragmentABinding

class FragA : Fragment() {

    private val bottomNavigationVM : BottomNavigationVM by activityViewModels()
    private lateinit var binding : FragmentABinding

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        binding = FragmentABinding.inflate(inflater, container, false)
        return binding.root
    }
}