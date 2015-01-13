package main

import (
	"encoding/xml"
	"errors"
	"io/ioutil"
	"path/filepath"
)

// ioExtSheet is a worksheet_key/sheet_id of I/O extended Google Sheet.
const ioExtSheet = "1C5_yRUvHCwZEWiNZl1fjdM9-t9HFw0MpNDRyIseji5I/od6"

// extFeed is the root element of a Google Sheet feed.
type extFeed struct {
	XMLName xml.Name    `xml:"feed"`
	Entries []*extEntry `xml:"entry"`
}

// extEntry represents a single entiry of a Google Sheet form
// for I/O extended registration.
type extEntry struct {
	Name string  `json:"name" xml:"http://schemas.google.com/spreadsheets/2006/extended eventname"`
	Link string  `json:"link" xml:"http://schemas.google.com/spreadsheets/2006/extended googleeventlink"`
	Lat  float64 `json:"lat" xml:"http://schemas.google.com/spreadsheets/2006/extended latitude"`
	Lng  float64 `json:"lng" xml:"http://schemas.google.com/spreadsheets/2006/extended longitude"`
}

// ioExtEntries returns a slice of extEntry items
// from either locally stored file (in 'dev' mode) or a Google Sheet ioExtSheet.
func ioExtEntries() ([]*extEntry, error) {
	var (
		b   []byte
		err error
	)
	switch appEnv {
	case "dev":
		xmlfile := filepath.Join(rootDir, "temporary_api", "ioext_feed.xml")
		b, err = ioutil.ReadFile(xmlfile)
	default:
		b, err = fetchListFeed(ioExtSheet)
	}
	if err != nil {
		return nil, err
	}

	feed := &extFeed{}
	if err := xml.Unmarshal(b, feed); err != nil {
		return nil, err
	}

	return feed.Entries, nil
}

// fetchListFeed retrieves a list feed of a Google Spreadsheet
// identified by sheet arg.
func fetchListFeed(sheet string) ([]byte, error) {
	return nil, errors.New("Not implemented")
}
