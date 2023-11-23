//
//  GridView.swift
//  Study_SwiftUI
//
//  Created by C.A.V.S.S on 2023/11/24.
//

import SwiftUI

struct GridView<Content : View>: View {
    let getDivide : Int
    let getGridType : GridType
    let getItemtype : GridItem.Size
    let getSpacing : CGFloat
    let getContent : () -> Content

    init(
        setDivide : Int,
        setGridType : GridType,
        setItemtype : GridItem.Size,
        setSpacing : CGFloat,
        @ViewBuilder setContent : @escaping () -> Content
    ){
        self.getDivide = setDivide
        self.getGridType = setGridType
        self.getItemtype = setItemtype
        self.getSpacing = setSpacing
        self.getContent = setContent
    }
    
    private func setDividedList(itemType : GridItem.Size) -> [GridItem] {
        var emptyList : [GridItem] = []
        for _ in 0...(getDivide - 1){
            emptyList.append(GridItem(itemType))
        }
        return emptyList
    }
        
    var body: some View {
        switch getGridType {
        case GridType.VERTICAL:
            LazyVGrid(
                columns : setDividedList(itemType: getItemtype),
                alignment : HorizontalAlignment.center,
                spacing : getSpacing,
                content : getContent
            )
        case GridType.HORIZONTAL:
            LazyHGrid(
                rows : setDividedList(itemType: getItemtype),
                alignment : VerticalAlignment.center,
                spacing :  getSpacing,
                content : getContent
            )
        default:
            LazyVGrid(
                columns : setDividedList(itemType: getItemtype),
                alignment : HorizontalAlignment.center,
                spacing : getSpacing,
                content : getContent
            )
        }
    }
}
