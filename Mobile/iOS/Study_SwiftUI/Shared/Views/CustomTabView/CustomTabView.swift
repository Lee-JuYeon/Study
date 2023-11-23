//
//  CustomTabView.swift
//  Study_SwiftUI
//
//  Created by C.A.V.S.S on 2023/11/24.
//

import SwiftUI

struct CustomTabView<Content: View>: View {
    
    @Binding var selectedIndex: Int
    @ViewBuilder let content: (Int) -> Content
    
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        VStack(
            alignment : HorizontalAlignment.center,
            spacing: 0
        ) {
            TabView(
                selection: $selectedIndex
            ) {
                ForEach(CustomTabItemModel.CustomTabItemModelList.indices) { index in
                    content(index)
                        .tag(index)
                }
            }
            .background(Color.blue
            )
            
            CustomTabBottom(
                setTabItemModels: CustomTabItemModel.CustomTabItemModelList,
                setTabItemImageSize: 25,
                setItemCliekd: { clickedItemTitle in
                    switch clickedItemTitle {
                    case CustomTabItemModel.CustomTabItemModelList[0].title :
                        selectedIndex = 0
                    case CustomTabItemModel.CustomTabItemModelList[1].title :
                        selectedIndex = 1
                    case CustomTabItemModel.CustomTabItemModelList[2].title :
                        selectedIndex = 2
                    default:
                        selectedIndex = 0
                    }
                }
            )
        }
    }
}
