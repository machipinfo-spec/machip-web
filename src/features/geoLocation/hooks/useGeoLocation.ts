import { useCallback, useState } from "react";

export type Location = {
  city: string;
  town: string;
  prefecture: string;
};

export function useGeoLocation() {
  const [location, setLocation] = useState<Location>();

  /** ポイント登録 */
  const fetchLocation = useCallback(async (lat: number, lng: number) => {
    if (!lat || !lng) {
      alert("緯度経度を入れてください。");
      return;
    }
    let l;
    try {
      const response = await fetch(
        `https://geoapi.heartrails.com/api/xml?method=searchByGeoLocation&x=${lng}&y=${lat}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const body = await response.text();

        // XML文字列をDOMにパース
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(body, "application/xml");

        // 必要なデータを取得
        const city = xmlDoc.querySelector("city")?.textContent || "不明";
        const town = xmlDoc.querySelector("town")?.textContent || "不明";
        const prefecture =
          xmlDoc.querySelector("prefecture")?.textContent || "不明";
        // ステートを更新
        l = { city, town, prefecture };
        setLocation(l);
      } else {
        alert("送信に失敗しました。");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("エラーが発生しました。");
    }

    return l;
  }, []);

  return {
    fetchLocation,
    location,
  };
}
