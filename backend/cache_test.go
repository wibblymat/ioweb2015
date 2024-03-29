package main

import (
	"testing"
	"time"

	"golang.org/x/net/context"
)

func TestMemoryCacheHit(t *testing.T) {
	const (
		key  = "test"
		data = "dummy"
	)
	mc := newMemoryCache()

	err := mc.set(context.Background(), key, []byte(data), time.Hour)
	if err != nil {
		t.Errorf("mc.set(%q, %q): %v", key, data, err)
	}

	res, err := mc.get(context.Background(), key)
	if err != nil {
		t.Fatalf("mc.get(%q): %v", key, err)
	}
	if s := string(res); s != data {
		t.Errorf("mc.get(%q) = %q; want %q", key, s, data)
	}
}

func TestMemoryCacheMiss(t *testing.T) {
	const (
		key  = "test"
		data = "dummy"
	)
	mc := newMemoryCache()

	err := mc.set(context.Background(), key, []byte(data), time.Millisecond)
	if err != nil {
		t.Fatalf("mc.set(%q, %q): %v", key, data, err)
	}

	time.Sleep(2 * time.Millisecond)
	res, err := mc.get(context.Background(), key)
	if err != errCacheMiss {
		t.Errorf("mc.get(%q) = %q (%v); want errCacheMiss", key, string(res), err)
	}
}
