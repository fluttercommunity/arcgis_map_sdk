import Foundation

class JsonUtil {
    static func objectOfJson<T: Decodable>(_ dict: Dictionary<String, Any>) throws -> T {
        guard let data = try? JSONSerialization.data(withJSONObject: dict, options: .prettyPrinted),
              let object = try? JSONDecoder().decode(T.self, from: data)
        else {
            throw "Unable to parse \(T.self) from \(dict)"
        }

        return object
    }
}

extension Encodable {
    var dictionary: [String: Any]? {
        guard let data = try? JSONEncoder().encode(self) else {
            return nil
        }
        return (try? JSONSerialization.jsonObject(with: data, options: .allowFragments)).flatMap {
            $0 as? [String: Any]
        }
    }
}
