//
//  CustomTabBottomItem.swift
//  Study_SwiftUI
//
//  Created by C.A.V.S.S on 2023/11/24.
//

import SwiftUI

struct CustomTabBottomItem: View {
    
    private var model : CustomTabItemModel
    @Binding private var currentItem: String
    private var getTabItemImageSize : CGFloat
    private var getItemClicked : (String) -> Void

    
    init(
        setModel : CustomTabItemModel,
        setCurrentItem : Binding<String>,
        setTabItemImageSize : CGFloat,
        setItemCliekd : @escaping (String) -> Void
    ){
        self.model = setModel
        self._currentItem = setCurrentItem
        self.getTabItemImageSize = setTabItemImageSize
        self.getItemClicked = setItemCliekd
    }
    
    @Environment(\.colorScheme) private var scheme
    var body: some View {
        VStack(
            alignment : HorizontalAlignment.center,
            spacing: 0
        ){
            Image(model.image)
                .resizable()
                .renderingMode(.template)
                .foregroundColor( model.title == currentItem ? Theme.customTabItemColour(forScheme: scheme) : Theme.customTabItemColour(forScheme: scheme))
                .frame(
                    width: model.title == currentItem ? getTabItemImageSize : getTabItemImageSize - 10,
                    height: model.title == currentItem ? getTabItemImageSize : getTabItemImageSize - 10
                )
                
            
            Spacer().frame(height: 4)
            
            Text(LocalizedStringKey(model.title))
                .foregroundColor(
                    model.title == currentItem ? Theme.customTabItemColour(forScheme: scheme) : Theme.customTabItemColour(forScheme: scheme)
                )
                .font(.system(
                    size: model.title == currentItem ? getTabItemImageSize - 10 : (getTabItemImageSize - 10) - 5,
                    weight: model.title == currentItem ? .bold : .light
                ))
            
        }
        .onTapGesture {
            currentItem = model.title
            getItemClicked(currentItem)
        }
    }
}
