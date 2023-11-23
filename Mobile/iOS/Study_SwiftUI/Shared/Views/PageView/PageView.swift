//
//  PageView.swift
//  Study_SwiftUI
//
//  Created by C.A.V.S.S on 2023/11/24.
//

import SwiftUI

struct PageView<GetView : View, BACKGROUND : View>: View {
    
    @Environment(\.scenePhase) private var scenePhase
    
    private var getHeight : CGFloat
    private var getWidth  : CGFloat
    private var getContent : GetView
    private var getBackground : BACKGROUND
    private var getPageCount : Int
    private var getScrollable : Bool
    @Binding var getCurrrentIndex : Int

    init(
        setWidth : CGFloat,
        setHeight : CGFloat,
        setPageCount : Int,
        setScrollable : Bool,
        setCurrentIndex : Binding<Int>,
        @ViewBuilder setBackground : @escaping () -> BACKGROUND,
        @ViewBuilder setContent : @escaping () -> GetView
    ) {
        self.getWidth = setWidth
        self.getHeight = setHeight
        self._getCurrrentIndex = setCurrentIndex
        self.getPageCount = setPageCount
        self.getScrollable = setScrollable
        self.getBackground = setBackground()
        self.getContent = setContent()
    }

    @GestureState private var translation : CGFloat = 0
    
    var body: some View {
        HStack(spacing: 0) {
            self.getContent
                .frame(
                    width: getWidth,
                    height: getHeight
                )
                
        }
        .frame(
            minWidth: 0,
            maxWidth: .infinity,
            minHeight: 0,
            maxHeight: .infinity,
            alignment: .leading
        )
        .offset( x: -CGFloat(self.getCurrrentIndex) * getWidth)
        .offset(x: self.translation)
        .gesture(
            DragGesture()
                .updating(self.$translation) { value, state, _ in
                    if(getScrollable == true){
                        state = value.translation.width
                    }
                }.onEnded { value in
                    if(getScrollable == true){
                        let offset = value.translation.width / getWidth
                        let newIndex = (CGFloat(self.getCurrrentIndex) - offset).rounded()
                        self.getCurrrentIndex = min(max(Int(newIndex), 0), self.getPageCount - 1)
                    }
                }
        )
        .background(getBackground)
        .onAppear {
//            print("viewDidAppear 뷰가 보였을때")
        }
        .onDisappear {
//            print("viewDidDisappear 뷰가 사라졌을 때")
        }
        .onChange(of: scenePhase) { (phase) in
//            switch phase{
//            case .active:
//                print("active")
//            case .background:
//                print("background")
//            case .inactive:
//                print("inactive")
//            default:
//                print("default")
//            }
        }
        .onOpenURL { url in
//            print("특정 url로 이동시 상태변화")
//            print("url : \(url)")
        }
    }
}
