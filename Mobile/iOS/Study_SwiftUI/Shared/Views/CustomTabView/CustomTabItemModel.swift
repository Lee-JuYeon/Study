//
//  CustomTabItemModel.swift
//  Study_SwiftUI
//
//  Created by C.A.V.S.S on 2023/11/24.
//

import SwiftUI

struct CustomTabItemModel : Hashable{
    let image: String
    let title: String
}

extension CustomTabItemModel {
    static var CustomTabItemModelList = [
        CustomTabItemModel(image: "icon_people", title: "tab_mates"),
        CustomTabItemModel(image: "icon_chat", title: "tab_chat"),
        CustomTabItemModel(image: "icon_profile", title: "tab_profile")
    ]
}
