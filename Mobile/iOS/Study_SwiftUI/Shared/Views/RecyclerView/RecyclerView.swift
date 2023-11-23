//
//  RecyclerView.swift
//  Study_SwiftUI
//
//  Created by C.A.V.S.S on 2023/11/24.
//

import SwiftUI


struct RecyclerView<GetViewHolder : View>: View {
    
    private var getAxis : RecyclerViewAxis
    private var getShowBar : Bool
    private var getSpacing : CGFloat
    private var getHorizontalAlignment : HorizontalAlignment
    private var getVerticalAlignment : VerticalAlignment
    @ViewBuilder private var getContent : GetViewHolder
    
    init(
        setAxis : RecyclerViewAxis, // recyclerview의 스크롤 방향
        setShowBar : Bool, // recyclerview의 스크롤 할 떄에 생기는 Bar를 보여줄건지 아닌지의 여부.
        setSpacing : CGFloat, // recyclerview의 cell(viewholder)간의 간격을 n만큼 늘린다.
        setHorizontalAlignment : HorizontalAlignment? = HorizontalAlignment.center,
        setVerticalAlignment : VerticalAlignment? = VerticalAlignment.center,
        setContent : @escaping () -> GetViewHolder
    ) {
        self.getContent = setContent()
        self.getAxis = setAxis
        self.getShowBar = setShowBar
        self.getSpacing = setSpacing
        self.getHorizontalAlignment = setHorizontalAlignment ?? HorizontalAlignment.center
        self.getVerticalAlignment = setVerticalAlignment ?? VerticalAlignment.center
    }
    
    var body: some View {
        ScrollView(setScrollAxis(get: getAxis), showsIndicators : getShowBar){
            switch getAxis {
            case .VERTICAL :
                LazyVStack(alignment: getHorizontalAlignment, spacing: getSpacing){
                    getContent
                }
            case .HORIZONTAL :
                LazyHStack( alignment: getVerticalAlignment, spacing: getSpacing){
                    getContent
                }
            }
        }
    }
    
    // scrollview의 스크롤 방향을 설정한다.
    private func setScrollAxis(get : RecyclerViewAxis) -> Axis.Set {
        switch get {
        case .VERTICAL :
            return Axis.Set.vertical
        case .HORIZONTAL :
            return Axis.Set.horizontal
        }
    }
}
