package com.cavss.studyxml.ui.custom.bottomnavigtion

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.cavss.studyxml.databinding.FragmentBBinding

class FragB : Fragment() {

    private val bottomNavigationVM : BottomNavigationVM by activityViewModels()
    private lateinit var binding : FragmentBBinding

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        binding = FragmentBBinding.inflate(inflater, container, false)
        return binding.root
    }
}