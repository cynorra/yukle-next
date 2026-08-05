package com.cynorra.loadly;

import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.os.Message;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.ProgressBar;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.browser.customtabs.CustomTabsIntent;

public class MainActivity extends AppCompatActivity {

    private static final String APP_HOST = "loadlyapp.com";

    private WebView webView;
    private ProgressBar progressBar;
    private LinearLayout errorLayout;
    private ValueCallback<Uri[]> pendingFileCallback;

    private final ActivityResultLauncher<String> fileChooserLauncher =
            registerForActivityResult(new ActivityResultContracts.GetContent(), uri -> {
                if (pendingFileCallback != null) {
                    pendingFileCallback.onReceiveValue(uri != null ? new Uri[]{uri} : null);
                    pendingFileCallback = null;
                }
            });

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);
        errorLayout = findViewById(R.id.errorLayout);

        setupWebView();
        setupBackPressed();

        // Load the live Next.js URL
        webView.loadUrl("https://loadlyapp.com/en");

        findViewById(R.id.retryButton).setOnClickListener(v -> {
            errorLayout.setVisibility(View.GONE);
            webView.reload();
        });
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setSupportMultipleWindows(true);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleUrl(request.getUrl());
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
                errorLayout.setVisibility(View.GONE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    webView.setVisibility(View.GONE);
                    errorLayout.setVisibility(View.VISIBLE);
                    progressBar.setVisibility(View.GONE);
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
            }

            // Handles links/JS window.open() calls that request a new window
            // (target="_blank", Google OAuth popups, "Öne çıkan" share links, etc.)
            @Override
            public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, Message resultMsg) {
                WebView transportWebView = new WebView(MainActivity.this);
                transportWebView.setWebViewClient(new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest request) {
                        openExternally(request.getUrl());
                        return true;
                    }
                });
                WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                transport.setWebView(transportWebView);
                resultMsg.sendToTarget();
                return true;
            }

            // Handles <input type="file"> (e.g. profile photo upload)
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (pendingFileCallback != null) {
                    pendingFileCallback.onReceiveValue(null);
                }
                pendingFileCallback = filePathCallback;
                try {
                    String[] acceptTypes = fileChooserParams.getAcceptTypes();
                    String mimeType = (acceptTypes != null && acceptTypes.length > 0 && !acceptTypes[0].isEmpty())
                            ? acceptTypes[0] : "*/*";
                    fileChooserLauncher.launch(mimeType);
                } catch (Exception e) {
                    pendingFileCallback = null;
                    return false;
                }
                return true;
            }
        });

        // Any downloadable file (invoices, documents) opens externally instead of failing silently
        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) ->
                openExternally(Uri.parse(url)));
    }

    /**
     * @return true if the URL was handled outside the WebView (navigation should stop),
     *         false to let the WebView load it normally.
     */
    private boolean handleUrl(Uri uri) {
        String scheme = uri.getScheme();
        if ("mailto".equals(scheme)) {
            safeStart(new Intent(Intent.ACTION_SENDTO, uri));
            return true;
        }
        if ("tel".equals(scheme)) {
            safeStart(new Intent(Intent.ACTION_DIAL, uri));
            return true;
        }
        if ("http".equals(scheme) || "https".equals(scheme)) {
            String host = uri.getHost();
            boolean isOwnSite = host != null && (host.equals(APP_HOST) || host.endsWith("." + APP_HOST));
            if (isOwnSite) {
                return false; // keep in-app
            }
            openExternally(uri); // Google OAuth, social links, etc.
            return true;
        }
        // Unknown scheme (intent://, market://, whatsapp://, ...)
        safeStart(new Intent(Intent.ACTION_VIEW, uri));
        return true;
    }

    private void openExternally(Uri uri) {
        try {
            new CustomTabsIntent.Builder().build().launchUrl(this, uri);
        } catch (ActivityNotFoundException e) {
            safeStart(new Intent(Intent.ACTION_VIEW, uri));
        }
    }

    private void safeStart(Intent intent) {
        try {
            startActivity(intent);
        } catch (ActivityNotFoundException ignored) {
            // No app installed to handle this action; nothing we can do.
        }
    }

    private void setupBackPressed() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    finish();
                }
            }
        });
    }
}
