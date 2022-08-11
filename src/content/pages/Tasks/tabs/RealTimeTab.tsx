import { buttonUnstyledClasses } from "@mui/base";
import { Box } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterContext } from "src/contexts/FilterContext";
import { InputTypeEnum } from "../../FormFields/form-field.interface";
import "./style.css";

const ISRAEL_LOCATION = {
  lat: 31.0461,
  lng: 34.8516,
};

const RealTimeTab = () => {
  const context = useContext(FilterContext);

  const {
    handleFilter: { selectedRows, originalData },
  } = context;

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const data = useMemo(() => {
    return originalData.find(
      (item) => item._id === selectedRows[selectedRows.length - 1]
    );
  }, [selectedRows]);

  const unmountScripts = () => {
    const scripts = document.querySelectorAll(
      'script[src^="https://maps.googleapis.com"]'
    );

    scripts.forEach((item) => {
      item.remove();
    });
  };

  useEffect(() => {
    if (typeof window["initMap"] === "undefined" && data) {
      window["initMap"] = () => {
        const geo = data?.form?.find(
          (item) => item.inputType === InputTypeEnum.GEO
        ).value;

        const address = data.taskDetails.find(
          (item) => item.key === "propertyAddress"
        );

        const mapContainer = document.querySelector("#google-map");

        if (typeof window["google"] === "undefined" || (!geo && !address)) {
          mapContainer.textContent = t("noDataAvailable");
          return;
        }

        let google = window["google"];

        const map = new google.maps.Map(mapContainer, {
          zoom: 17,
          center: ISRAEL_LOCATION,
        });

        const bounds = new google.maps.LatLngBounds();

        if (geo) {
          const {
            coords: { latitude, longitude },
          } = geo.value;

          const pos = { lat: latitude, lng: longitude };

          const marker = new google.maps.Marker({
            position: pos,
            map: map,
          });

          const infowindow = new google.maps.InfoWindow({
            content: `<b>${t("agentLocation")}</b>`,
          });

          infowindow.open({
            anchor: marker,
            map,
          });

          bounds.extend(pos);
          map.setCenter(pos);
        }

        if (address) {
          const coder = new google.maps.Geocoder();

          coder
            .geocode({
              address: `${address.value} israel`,
            })
            .then((res) => {
              const item = res.results[0];

              if (item) {
                const lat = item.geometry.location.lat();
                const lng = item.geometry.location.lng();

                const pos = { lat, lng };

                const marker = new google.maps.Marker({
                  position: pos,
                  map,
                });

                const infowindow = new google.maps.InfoWindow({
                  content: `<b>${t("addressLocation")}</b>`,
                });

                infowindow.open({
                  anchor: marker,
                  map,
                });

                bounds.extend(pos);
                map.setCenter(pos);
              }
            });
        }

        if (geo && address) map.fitBounds(bounds);
      };
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCUxERIz0nUyUh46I0L7zPPSg0yAhz3R1E&callback=initMap&v=3&libraries=places&language=${language}`;
    script.async = true;
    document.querySelector("head").appendChild(script);

    return () => {
      delete window["initMap"];
      delete window["google"];

      unmountScripts();
    };
  }, [data, language]);

  if (!data) return <>{t("noDataAvailable")}</>;
  return <div id="google-map"></div>;
};

export default RealTimeTab;
