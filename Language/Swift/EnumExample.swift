
enum School {
    case elementary, middle, high
}

enum SchoolDetail {
    case elementary(name : String)
    case middle(name : String)
    case high(name : String)

    func getNameInsteadOfRawValue() -> String {
        /*
        rawValue 말고도 변수를 따로 지정해서,
        지정된 rawValue가 아닌 다른 rawValue값을 나오게 할 수 있다.
        아래는 2가지 방식의 예이다.
        */
        switch self {
        case .elementary(let name):
            return name
        case let .middle(name):
            return name
        case .high(let name) :
            return name
        }
    }
}


let schoolDetail = SchoolDetail.elementary(name: "test11")
let schoolGetName = schoolDetail.getNameInsteadOfRawValue()
/*
  schoolDetail의 변수에서 'test11'을 지정해놔서,
  결과값이 test11이 뜬다.
  getNameInsteaadOfRawValue()는 .rawValue를 대신해서 사용하는 것.
 */
print("\(schoolGetName)") 
