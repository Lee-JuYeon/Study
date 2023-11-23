//
//  Theme.swift
//  Study_SwiftUI
//
//  Created by C.A.V.S.S on 2023/11/24.
//

import Foundation
import SwiftUI

struct Theme {
    static let trendRed = Color(hex : 0xba2649)
    static let trendPink = Color(hex : 0xffa7ca)
    static let trendGreen = Color(hex : 0x1a6b54)
    static let trendPurple = Color(hex : 0xad93b4)
    static let trendYellow = Color(hex : 0xeae033)

    
    static func backgroundColour(forScheme scheme: ColorScheme) -> Color {
        let lightColour = Color("colour_main")
        let darckColour = Color("colour_main")
           
        switch scheme {
        case .light :
            return lightColour
        case .dark :
            return darckColour
        @unknown default:
            return lightColour
        }
    }
    
    static func textColour(forScheme scheme : ColorScheme) -> Color {
        
        let lightTheme = Color.black
        let darckTheme = Color.white
           
        switch scheme {
        case .light :
            return lightTheme
        case .dark :
            return darckTheme
        @unknown default:
            return lightTheme
        }
    }
    
    static func selectedTextColour(forScheme scheme : ColorScheme) -> Color {
        
        let lightTheme = Color.black
        let darckTheme = Color.white
           
        switch scheme {
        case .light :
            return lightTheme
        case .dark :
            return darckTheme
        @unknown default:
            return lightTheme
        }
    }
    
    static func hintColour(forScheme scheme : ColorScheme) -> Color {
        
        let lightTheme = Color.black.opacity(0.5)
        let darckTheme = Color.black.opacity(0.5)
           
        switch scheme {
        case .light :
            return lightTheme
        case .dark :
            return darckTheme
        @unknown default:
            return lightTheme
        }
    }
    
    static func shadowColour(forScheme scheme : ColorScheme) -> Color {
        
        let lightTheme = Color.black
        let darckTheme = Color.black
           
        switch scheme {
        case .light :
            return lightTheme
        case .dark :
            return darckTheme
        @unknown default:
            return lightTheme
        }
    }
    
    static func buttonColour(forScheme scheme : ColorScheme) -> Color {
        
        let lightTheme = Color("colour_button")
        let darckTheme = Color("colour_button")
           
        switch scheme {
        case .light :
            return lightTheme
        case .dark :
            return darckTheme
        @unknown default:
            return lightTheme
        }
    }
    
    static func textFieldBackgroundColour(forScheme scheme : ColorScheme) -> Color {
        
        let lightTheme = Color("colour_button")
        let darckTheme = Color("colour_button")
           
        switch scheme {
        case .light :
            return lightTheme
        case .dark :
            return darckTheme
        @unknown default:
            return lightTheme
        }
    }
    
    static func customTabBackgroundColour(forScheme scheme : ColorScheme) -> Color {
        
        let lightTheme = Color("colour_button")
        let darckTheme = Color("colour_button")
           
        switch scheme {
        case .light :
            return lightTheme
        case .dark :
            return darckTheme
        @unknown default:
            return lightTheme
        }
    }
    
    static func customTabItemColour(forScheme scheme : ColorScheme) -> Color {
        
        let lightTheme = Color.black.opacity(0.9)
        let darckTheme = Color.black.opacity(0.7)
           
        switch scheme {
        case .light :
            return lightTheme
        case .dark :
            return darckTheme
        @unknown default:
            return lightTheme
        }
    }
}
